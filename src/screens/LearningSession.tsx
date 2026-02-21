import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Headphones, Play, Pause, CheckCircle2, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/cn';

export default function LearningSession({ onExit }: { onExit: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const steps = [
    {
      type: 'audio',
      title: 'Упражнение на слух',
      subtitle: 'Секция 1: Интерпретация карт',
      content: 'Послушайте гида, описывающего план университетского кампуса. Обратите внимание на пространственные предлоги.',
      duration: '02:45'
    },
    {
      type: 'question',
      title: 'Быстрая проверка',
      subtitle: 'Где находится библиотека?',
      options: [
        'Напротив Студенческого союза',
        'За научной лабораторией',
        'Рядом с главными воротами',
        'У спортивного центра'
      ],
      correct: 0
    }
  ];

  const handleNext = () => {
    setShowFeedback(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowFeedback(false);
    } else {
      onExit();
    }
  };

  const handleCheck = () => {
    if (answers[currentStep] !== null) {
      setShowFeedback(true);
    }
  };

  const setStepAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentStep]: optionIndex });
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-8 max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center w-full"
        >
          <div className="w-24 h-24 rounded-[32px] bg-blue-50 mx-auto mb-12 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-4xl text-heading mb-4">Отличная<br />работа!</h2>
          <p className="text-subheading text-lg mb-12">
            Вы освоили пространственную лексику. <br />
            <span className="text-[var(--ink)] font-bold">+150 XP получено</span>
          </p>
          <button onClick={onExit} className="btn-primary w-full">
            Вернуться в меню
          </button>
        </motion.div>
      </div>
    );
  }

  const step = steps[currentStep];
  const selectedOption = answers[currentStep] ?? null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col max-w-md mx-auto">
      {/* Header with segmented progress bar */}
      <header className="px-6 pt-12 pb-6 flex items-center gap-4">
        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "progress-segment flex-1",
                i <= currentStep ? "progress-active" : ""
              )}
            />
          ))}
        </div>
        <div className="font-bold text-xs opacity-40">
          {currentStep + 1} / {steps.length}
        </div>
      </header>

      <main className="flex-1 px-6 pt-12 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-10">
              <p className="text-subheading text-xs uppercase tracking-widest mb-2">{step.subtitle}</p>
              <h2 className="text-3xl text-heading">
                {step.title}
              </h2>
            </div>

            {step.type === 'audio' ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 card-modern bg-slate-50 border-none p-8 mb-12 flex flex-col items-center justify-center relative group">
                  <div className="w-24 h-24 rounded-[32px] bg-blue-100 flex items-center justify-center mb-12 shadow-sm">
                    <Headphones size={32} className="text-blue-600" />
                  </div>

                  <p className="text-center text-lg font-medium text-slate-600 mb-12 leading-relaxed">
                    {step.content}
                  </p>

                  <div className="w-full space-y-4">
                    <div className="h-2 bg-white w-full rounded-full relative">
                      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-[var(--accent)] rounded-full shadow-md border-2 border-white"></div>
                    </div>
                    <div className="flex justify-between font-bold text-[10px] opacity-40 uppercase tracking-widest">
                      <span>00:54</span>
                      <span>{step.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center mb-12">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-[var(--ink)] text-white flex items-center justify-center hover:scale-105 transition-all mb-12 active:scale-95 shadow-xl shadow-slate-900/20"
                  >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                  </button>

                  <button onClick={handleNext} className="btn-primary w-full">
                    Продолжить
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  {step.options?.map((option, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = showFeedback && i === step.correct;
                    const isWrong = showFeedback && isSelected && i !== step.correct;

                    return (
                      <motion.div
                        key={i}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !showFeedback && setStepAnswer(i)}
                        className={cn(
                          "card-modern flex items-center gap-5",
                          isSelected && !showFeedback ? "card-selected" : "",
                          isCorrect ? "border-emerald-500 bg-emerald-50" : "",
                          isWrong ? "border-rose-500 bg-rose-50" : ""
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors",
                          isSelected || isCorrect || isWrong ? "bg-white" : "bg-slate-50 text-slate-400"
                        )}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-bold text-lg">{option}</span>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="py-12">
                  {!showFeedback ? (
                    <button 
                      disabled={selectedOption === null}
                      onClick={handleCheck}
                      className="btn-primary w-full"
                    >
                      Проверить
                    </button>
                  ) : (
                    <button 
                      onClick={handleNext}
                      className={cn(
                        "btn-primary w-full",
                        selectedOption === step.correct ? "bg-emerald-600" : "bg-slate-800"
                      )}
                    >
                      Следующий вопрос
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
