import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Target, BookOpen, Clock, Brain, GraduationCap, ArrowLeft, Headphones, PenTool, Mic2, Briefcase, School, User, Sparkles, Zap, Flame, Rocket, Coffee } from 'lucide-react';
import { cn } from '../utils/cn';

interface OnboardingData {
  name: string;
  reason: string;
  isFirstTime: string;
  targetScore: number;
  hardestPart: string;
  timeCommitment: string;
  examDate: string;
}

export default function Onboarding({ onComplete }: { onComplete: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    reason: '',
    isFirstTime: '',
    targetScore: 7.0,
    hardestPart: '',
    timeCommitment: '',
    examDate: '',
  });

  const steps = [
    {
      id: 'name',
      title: 'Как нам к вам обращаться?',
      subtitle: 'Ваше имя поможет нам персонализировать обучение.',
      type: 'input',
      placeholder: 'Введите ваше имя',
    },
    {
      id: 'reason',
      title: 'Зачем ты готовишься к IELTS?',
      subtitle: 'Выбери основную цель',
      options: [
        { label: 'Учеба за границей', value: 'Study Abroad', desc: 'Поступление в зарубежные вузы', icon: School, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Карьера / Иммиграция', value: 'Work Opportunities', desc: 'Работа и переезд', icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Поступление в местный ВУЗ', value: 'Local Uni', desc: 'Местное образование', icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Я преподаю IELTS', value: 'Teaching', desc: 'Для профессионалов', icon: User, color: 'text-purple-500', bg: 'bg-purple-50' },
      ],
    },
    {
      id: 'isFirstTime',
      title: 'Вы уже сдавали IELTS?',
      subtitle: 'Это поможет нам определить ваш уровень.',
      options: [
        { label: 'Впервые', value: 'yes', desc: 'Я новичок', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Уже сдавал', value: 'no', desc: 'Хочу улучшить результат', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50' },
      ],
    },
    {
      id: 'targetScore',
      title: 'Ваша цель по баллам.',
      subtitle: 'Какой балл вам необходим?',
      type: 'slider',
      min: 4.0,
      max: 9.0,
      step: 0.5,
    },
    {
      id: 'hardestPart',
      title: 'Что для вас самое сложное?',
      subtitle: 'На чем нам стоит сфокусироваться?',
      options: [
        { label: 'Listening', desc: 'Понимание на слух', icon: Headphones, color: 'text-sky-500', bg: 'bg-sky-50' },
        { label: 'Reading', desc: 'Чтение и анализ', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Writing', desc: 'Письменная часть', icon: PenTool, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Speaking', desc: 'Разговорная практика', icon: Mic2, color: 'text-violet-500', bg: 'bg-violet-50' },
      ],
    },
    {
      id: 'examDate',
      title: 'Когда планируешь сдать IELTS?',
      subtitle: 'Это поможет составить план',
      options: [
        { label: 'Меньше месяца', value: '<1m', badge: 'Срочно' },
        { label: '1–3 месяца', value: '1-3m' },
        { label: '3–6 месяцев', value: '3-6m' },
        { label: 'Пока без даты', value: 'none' },
      ],
    },
    {
      id: 'timeCommitment',
      title: 'Сколько времени в день ты готов уделять?',
      subtitle: 'Мы подстроим план под тебя',
      options: [
        { label: '15 минут', value: '15m', desc: 'Быстрые упражнения', icon: Coffee, color: 'text-teal-500', bg: 'bg-teal-50' },
        { label: '30 минут', value: '30m', desc: 'Одна секция за раз', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: '1 час', value: '1h', desc: 'Полноценная практика', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: '2+ часа', value: 'max', desc: 'Интенсивная подготовка', icon: Rocket, color: 'text-rose-500', bg: 'bg-rose-50' },
      ],
    },
  ];

  const currentStep = steps[step];

  const handleNext = (value?: any) => {
    const newData = { ...data };
    if (value !== undefined) {
      (newData as any)[currentStep.id] = value;
      setData(newData);
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newData);
    }
  };

  const selectedValue = (data as any)[currentStep.id];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col p-6 max-w-md mx-auto">
      {/* Header with segmented progress bar */}
      <div className="flex items-center gap-4 mb-10 pt-2">
        <button 
          onClick={() => step > 0 && setStep(step - 1)}
          className={cn(
            "p-2 -ml-2 transition-opacity",
            step === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <ArrowLeft size={24} className="text-[var(--ink)]" />
        </button>
        <div className="flex-1 flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "progress-segment flex-1",
                i <= step ? "progress-active" : ""
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          <h1 className="text-heading mb-3">
            {currentStep.title}
          </h1>
          <p className="text-subheading mb-10">
            {currentStep.subtitle}
          </p>

          {currentStep.type === 'input' ? (
            <div className="space-y-10">
              <input
                autoFocus
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder={currentStep.placeholder}
                className="w-full bg-transparent border-b border-[var(--border)] py-4 text-2xl font-bold focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button 
                disabled={!data.name.trim()}
                onClick={() => handleNext()}
                className="btn-primary w-full"
              >
                Продолжить
              </button>
            </div>
          ) : currentStep.type === 'slider' ? (
            <div className="space-y-12">
              <div className="text-center py-10 card-modern bg-slate-50 border-none">
                <motion.span 
                  key={data.targetScore}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-7xl font-bold block text-[var(--accent)]"
                >
                  {data.targetScore.toFixed(1)}
                </motion.span>
                <p className="text-subheading mt-2 uppercase tracking-widest text-[10px] font-bold">Целевой балл</p>
              </div>
              <input
                type="range"
                min={currentStep.min}
                max={currentStep.max}
                step={currentStep.step}
                value={data.targetScore}
                onChange={(e) => setData({ ...data, targetScore: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-100 appearance-none cursor-pointer accent-[var(--accent)] rounded-full"
              />
              <button 
                onClick={() => handleNext()}
                className="btn-primary w-full"
              >
                Установить цель
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentStep.options?.map((option: any) => {
                const isSelected = selectedValue === (option.value || option.label);
                const Icon = option.icon;
                return (
                  <motion.div
                    key={option.label}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNext(option.value || option.label)}
                    className={cn(
                      "card-modern flex items-center gap-4",
                      isSelected ? "card-selected" : ""
                    )}
                  >
                    {Icon && (
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                        isSelected ? "bg-white" : option.bg,
                        isSelected ? option.color : option.color
                      )}>
                        <Icon size={24} strokeWidth={2.5} />
                      </div>
                    )}
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h4 className="card-title">{option.label}</h4>
                        {option.desc && <p className="card-desc mt-1">{option.desc}</p>}
                      </div>
                      {option.badge && (
                        <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {option.badge}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

