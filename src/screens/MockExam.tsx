import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Headphones, PenTool, Mic2, 
  Clock, ArrowRight, CheckCircle, X, Loader2
} from 'lucide-react';
import { cn } from '../utils/cn';

// Firebase imports
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { readingTest as fallbackData } from '../data/readingData';

type ExamStep = 'intro' | 'reading' | 'listening' | 'writing' | 'speaking' | 'result';

export default function MockExam() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ExamStep>('intro');
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [examData, setExamData] = useState<any>(null);

  const [readingAnswers, setReadingAnswers] = useState<Record<number, string>>({});
  const [writingText, setWritingText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const [writingScore, setWritingScore] = useState<number | null>(null);
  const [writingFeedback, setWritingFeedback] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Load exam from Firebase
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examRef = doc(db, "exams", "variant_1");
        const examSnap = await getDoc(examRef);

        if (examSnap.exists()) {
          setExamData(examSnap.data());
        } else {
          await setDoc(examRef, fallbackData);
          setExamData(fallbackData);
        }
      } catch (error) {
        console.error("Firebase error:", error);
        setExamData(fallbackData); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (timeLeft > 0 && currentStep !== 'intro' && currentStep !== 'result' && !isLoading && !isEvaluating) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, currentStep, isLoading, isEvaluating]);

  const startSection = (step: ExamStep, minutes: number) => {
    setCurrentStep(step);
    setTimeLeft(minutes * 60);
  };

  const calculateReadingScore = () => {
    if (!examData) return 0.0;
    let correctCount = 0;
    
    examData.questions.forEach((q: any) => {
      const userAnswer = (readingAnswers[q.id] || "").toString().toLowerCase().trim();
      const correctAnswer = q.correctAnswer.toLowerCase().trim();
      if (userAnswer === correctAnswer) correctCount++;
    });

    if (correctCount === 13) return 9.0;
    if (correctCount >= 11) return 8.0;
    if (correctCount >= 9) return 7.0;
    if (correctCount >= 7) return 6.0;
    if (correctCount >= 5) return 5.0;
    if (correctCount >= 3) return 4.0;
    return 0.0;
  };

  // --- AI EVALUATION (ENGLISH ONLY & STRICT) ---
  const evaluateWriting = async () => {
    const wordCount = writingText.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    if (wordCount < 10) {
      alert("Please write at least 10 words for the examiner to evaluate.");
      return;
    }

    setIsEvaluating(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert("API Key missing. Check your .env file.");
        setIsEvaluating(false);
        return;
      }

      const prompt = `
        You are a professional IELTS Writing Examiner. 
        Evaluate this Task 2 essay strictly according to the official IELTS criteria:
        1. Task Response
        2. Coherence and Cohesion
        3. Lexical Resource
        4. Grammatical Range and Accuracy

        ESSAY DATA:
        - Word Count: ${wordCount}
        - Essay Text: "${writingText}"

        STRICT RULES:
        - Penalty for length: If words < 150, maximum score is 5.0. If words < 250, penalize Task Response.
        - Be highly critical. Band 9.0 is only for perfect, native-level academic writing.
        - Provide feedback only in English.

        Return ONLY a valid JSON:
        { "score": number, "feedback": "2-sentence professional critique in English." }
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJson);

      setWritingScore(result.score);
      setWritingFeedback(result.feedback);
      
      startSection('speaking', 5);
    } catch (error) {
      console.error("AI Evaluation error:", error);
      alert("Failed to reach the AI examiner. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[var(--bg)] text-[var(--ink)] z-50 flex flex-col items-center justify-center max-w-md mx-auto">
        <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
        <h3 className="text-xl font-bold">Loading Exam...</h3>
        <p className="text-sm text-[var(--muted)]">Fetching data from Firebase</p>
      </div>
    );
  }

  const renderIntro = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 pt-12 text-center h-full flex flex-col justify-center">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} />
      </div>
      <h2 className="text-heading text-3xl mb-4">Diagnostic Test</h2>
      <p className="text-subheading mb-8">Complete the full test to determine your current IELTS band.</p>
      
      <div className="space-y-3 mb-10 text-left">
        {[
          { title: "Reading", time: "10 min", icon: BookOpen },
          { title: "Listening", time: "10 min", icon: Headphones },
          { title: "Writing", time: "15 min", icon: PenTool },
          { title: "Speaking", time: "5 min", icon: Mic2 },
        ].map((sec, i) => (
          <div key={i} className="card-modern flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <sec.icon className="text-[var(--accent)]" size={20} />
              <span className="font-bold text-[var(--ink)]">{sec.title}</span>
            </div>
            <span className="text-sm font-bold text-[var(--muted)]">{sec.time}</span>
          </div>
        ))}
      </div>

      <button onClick={() => startSection('reading', 10)} className="btn-primary w-full flex items-center justify-center gap-2 mt-auto">
        Start Exam <ArrowRight size={20} />
      </button>
    </motion.div>
  );

  const renderReading = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 pt-24 h-full flex flex-col">
      <div className="card-modern mb-6 overflow-y-auto max-h-[35vh]">
        <h3 className="font-bold text-lg mb-3 text-[var(--ink)]">{examData?.title}</h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
          {examData?.text}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pb-24">
        {examData?.questions?.map((q: any) => (
          <div key={q.id} className="space-y-3">
            <h4 className="font-bold text-[var(--ink)]">{q.question}</h4>
            
            {q.type === 'multiple_choice' && q.options && (
              <div className="space-y-2">
                {q.options.map((opt: string) => {
                  const isSelected = readingAnswers[q.id] === opt;
                  return (
                    <button 
                      key={opt}
                      onClick={() => setReadingAnswers({ ...readingAnswers, [q.id]: opt })}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left text-sm transition-all", 
                        isSelected 
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)] font-bold" 
                          : "border-[var(--border)] bg-[var(--card-bg)] text-[var(--ink)] hover:border-slate-400"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'text_input' && (
              <input 
                type="text" 
                placeholder="Type your answer..."
                value={readingAnswers[q.id] || ""}
                onChange={(e) => setReadingAnswers({ ...readingAnswers, [q.id]: e.target.value })}
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent">
        <button onClick={() => startSection('listening', 10)} className="btn-primary w-full shadow-lg">
          Finish Reading
        </button>
      </div>
    </motion.div>
  );

  const renderListening = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 pt-24 h-full flex flex-col">
      <div className="card-modern bg-blue-600 border-none text-white text-center py-10 mb-8">
        <Headphones size={48} className="mx-auto mb-4 opacity-80 animate-pulse" />
        <p className="font-bold">Audio playing...</p>
      </div>
      <button onClick={() => startSection('writing', 15)} className="btn-primary w-full mt-auto">Skip Section</button>
    </motion.div>
  );

  const renderWriting = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 pt-24 h-full flex flex-col">
      <div className="card-modern mb-4 bg-orange-50 dark:bg-orange-900/10 border-orange-200">
        <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-2">Task 2</h4>
        <p className="font-bold text-black-700 dark:text-black-100 mb-2">
          Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. To what extent do you agree?
        </p>
      </div>
      
      <textarea 
        value={writingText}
        onChange={(e) => setWritingText(e.target.value)}
        placeholder="Start writing your essay here..."
        disabled={isEvaluating}
        className="flex-1 w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--ink)] outline-none focus:border-blue-500 resize-none"
      />
      <div className="text-right text-xs text-[var(--muted)] mt-2 font-bold mb-4">
        {writingText.trim().split(/\s+/).filter(w => w.length > 0).length} words
      </div>
      
      <button 
        onClick={evaluateWriting}
        disabled={isEvaluating}
        className={cn("btn-primary w-full flex justify-center items-center gap-2", isEvaluating && "opacity-80")}
      >
        {isEvaluating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Examiner is evaluating...
          </>
        ) : (
          "Submit Essay"
        )}
      </button>
    </motion.div>
  );

  const renderSpeaking = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 pt-24 h-full flex flex-col text-center">
      <h3 className="text-heading mb-2">Part 2: Long Turn</h3>
      <div className="flex-1 flex items-center justify-center">
        <button 
          onPointerDown={() => setIsRecording(true)}
          onPointerUp={() => setIsRecording(false)}
          className={cn("w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-xl", isRecording ? "bg-red-500 scale-110" : "bg-blue-600 hover:bg-blue-700")}
        >
          <Mic2 size={40} className="text-white" />
        </button>
      </div>
      <button onClick={() => setCurrentStep('result')} className="btn-primary w-full mt-auto">Finish Exam</button>
    </motion.div>
  );

  const renderResult = () => {
    const readingScore = calculateReadingScore();
    const finalOverall = writingScore ? ((readingScore + writingScore) / 2).toFixed(1) : readingScore.toFixed(1);

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 pt-12 h-full flex flex-col justify-center text-center overflow-y-auto">
        <h2 className="text-heading text-3xl mb-2">Exam Completed!</h2>
        <p className="text-subheading mb-8">Your estimated IELTS Band Score</p>
        
        <div className="w-36 h-36 mx-auto rounded-full bg-blue-600 flex flex-col items-center justify-center text-white shadow-xl mb-8 shrink-0">
          <span className="text-5xl font-black tracking-tighter">{finalOverall}</span>
          <span className="text-[10px] uppercase tracking-widest opacity-80 mt-1 font-bold">Overall Band</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-modern py-3 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
            <p className="text-[10px] uppercase font-bold text-blue-600">Reading</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{readingScore.toFixed(1)}</p>
          </div>
          <div className="card-modern py-3 opacity-50">
            <p className="text-[10px] uppercase font-bold">Listening</p>
            <p className="text-xl font-bold">N/A</p>
          </div>
          <div className={cn("card-modern py-3", writingScore ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "opacity-50")}>
            <p className="text-[10px] uppercase font-bold text-orange-600">Writing</p>
            <p className="text-xl font-bold">{writingScore !== null ? writingScore.toFixed(1) : "N/A"}</p>
          </div>
          <div className="card-modern py-3 opacity-50">
            <p className="text-[10px] uppercase font-bold">Speaking</p>
            <p className="text-xl font-bold">N/A</p>
          </div>
        </div>

        {writingFeedback && (
          <div className="card-modern bg-orange-50 dark:bg-orange-900/10 text-left mb-6 p-4 border-orange-200">
            <p className="text-xs uppercase tracking-wider font-bold text-orange-500 mb-2">Examiner Feedback:</p>
            <p className="text-sm text-orange-900 dark:text-orange-200 leading-relaxed italic">"{writingFeedback}"</p>
          </div>
        )}

        <button onClick={() => navigate('/dashboard')} className="btn-primary w-full mt-auto mb-8">Back to Dashboard</button>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[var(--bg)] text-[var(--ink)] z-50 flex flex-col max-w-md mx-auto overflow-hidden">
      {currentStep !== 'intro' && currentStep !== 'result' && (
        <div className="absolute top-0 left-0 right-0 h-20 bg-[var(--bg)]/90 backdrop-blur-md z-40 px-6 flex items-center justify-between border-b border-[var(--border)]">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <X size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[var(--muted)]">{currentStep}</span>
            <div className={cn("flex items-center gap-1.5 font-bold text-lg", timeLeft < 60 ? "text-red-500" : "text-[var(--ink)]")}>
              <Clock size={16} />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-10" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'reading' && renderReading()}
        {currentStep === 'listening' && renderListening()}
        {currentStep === 'writing' && renderWriting()}
        {currentStep === 'speaking' && renderSpeaking()}
        {currentStep === 'result' && renderResult()}
      </AnimatePresence>
    </div>
  );
}