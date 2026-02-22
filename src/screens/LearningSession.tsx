import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle2, XCircle, Award } from 'lucide-react';
import { cn } from '../utils/cn';

// 1. НАШИ ЗАГОТОВЛЕННЫЕ МАТЕРИАЛЫ (В будущем они будут приходить из базы данных)
const mockLesson = {
  title: "The Great Barrier Reef",
  type: "Reading",
  text: "The Great Barrier Reef is the world's largest coral reef system composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometres over an area of approximately 344,400 square kilometres. The reef is located in the Coral Sea, off the coast of Queensland, Australia. The Great Barrier Reef can be seen from outer space and is the world's biggest single structure made by living organisms. This reef structure is composed of and built by billions of tiny organisms, known as coral polyps.",
  questions: [
    {
      id: 1,
      question: "Where is the Great Barrier Reef located?",
      options: [
        "In the Pacific Ocean, near Japan",
        "In the Coral Sea, off the coast of Australia",
        "In the Indian Ocean, near Indonesia",
        "In the Atlantic Ocean, near Brazil"
      ],
      correctAnswerIndex: 1 // Правильный ответ: второй вариант (индекс 1)
    },
    {
      id: 2,
      question: "What builds the structure of the Great Barrier Reef?",
      options: [
        "Volcanic activity",
        "Ocean currents",
        "Billions of tiny organisms called coral polyps",
        "Human intervention"
      ],
      correctAnswerIndex: 2 // Правильный ответ: третий вариант (индекс 2)
    }
  ]
};

export default function LearningSession({ onExit }: { onExit: () => void }) {
  // 2. СОСТОЯНИЯ ПРИЛОЖЕНИЯ
  // Храним выбранные ответы: ключ - ID вопроса, значение - индекс выбранного ответа
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  // Проверяем, завершен ли урок
  const [isFinished, setIsFinished] = useState(false);
  // Сколько правильных ответов
  const [score, setScore] = useState(0);

  // Функция для выбора ответа
  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (isFinished) return; // Если урок завершен, менять ответы нельзя
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  // Функция для проверки ответов и завершения урока
  const handleFinish = () => {
    let correctCount = 0;
    mockLesson.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setIsFinished(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col max-w-md mx-auto overflow-x-hidden">
      
      {/* Шапка урока */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[var(--bg)]/90 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={onExit}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center flex-1">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)]">{mockLesson.type} Practice</p>
          <h2 className="text-sm font-bold truncate max-w-[200px] mx-auto">{mockLesson.title}</h2>
        </div>
        <div className="w-10"></div> {/* Пустой блок для выравнивания шапки */}
      </header>

      {/* Основной контент */}
      <main className="flex-1 px-6 py-6 pb-32">
        
        {/* Текст для чтения */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            {mockLesson.text}
          </p>
        </div>

        {/* Вопросы */}
        <div className="space-y-8">
          {mockLesson.questions.map((q, index) => (
            <div key={q.id}>
              <h3 className="font-bold mb-4 text-[16px]">
                {index + 1}. {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  const isCorrect = q.correctAnswerIndex === optIdx;
                  const showSuccess = isFinished && isCorrect;
                  const showError = isFinished && isSelected && !isCorrect;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(q.id, optIdx)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3",
                        !isFinished && !isSelected && "border-slate-100 hover:border-slate-200 dark:border-slate-800",
                        !isFinished && isSelected && "border-[var(--accent)] bg-blue-50 dark:bg-blue-900/20",
                        showSuccess && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
                        showError && "border-red-500 bg-red-50 dark:bg-red-900/20"
                      )}
                    >
                      <span className={cn("text-[14px]", showSuccess && "text-emerald-700 dark:text-emerald-400 font-medium", showError && "text-red-700 dark:text-red-400")}>
                        {option}
                      </span>
                      {showSuccess && <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />}
                      {showError && <XCircle size={20} className="text-red-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Подвал с кнопкой действия */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent z-10">
        {!isFinished ? (
          <button 
            onClick={handleFinish}
            disabled={Object.keys(selectedAnswers).length < mockLesson.questions.length}
            className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Завершить и проверить
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 text-white rounded-2xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Award size={32} className="text-yellow-400" />
              <div>
                <p className="text-[12px] uppercase tracking-widest text-slate-400 font-bold mb-1">Ваш результат</p>
                <p className="font-bold text-xl">{score} из {mockLesson.questions.length}</p>
              </div>
            </div>
            <button 
              onClick={onExit}
              className="px-6 py-3 bg-white text-slate-800 rounded-xl font-bold text-sm hover:bg-slate-100 active:scale-95 transition-all"
            >
              На главную
            </button>
          </motion.div>
        )}
      </footer>
    </div>
  );
}