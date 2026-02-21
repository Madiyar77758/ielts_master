import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  PenTool, 
  Mic2, 
  Headphones, 
  TrendingUp, 
  Calendar,
  Settings,
  ChevronRight,
  Play,
  Sun,
  Moon,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function Dashboard({ onStartSession, isLight, onToggleTheme, userName }: { 
  onStartSession: () => void; 
  isLight: boolean; 
  onToggleTheme: () => void;
  userName: string;
}) {
  const sections = [
    { id: 'listening', title: 'Listening', icon: Headphones, progress: 65, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'reading', title: 'Reading', icon: BookOpen, progress: 40, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'writing', title: 'Writing', icon: PenTool, progress: 20, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'speaking', title: 'Speaking', icon: Mic2, progress: 10, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pb-36 max-w-md mx-auto">
      {/* Header */}
      <header className="px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={24} className="text-white fill-white/20" />
            </div>
            <div>
              <h2 className="text-heading text-[22px]">{userName}</h2>
              <p className="text-subheading text-[10px] uppercase tracking-[0.2em] font-bold">Уровень 12 • Pro</p>
            </div>
          </div>
          <button 
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all active:scale-90 border border-slate-100"
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-5 rounded-[20px] border border-slate-100">
            <p className="text-subheading text-[10px] uppercase tracking-widest mb-1 font-bold">Текущий балл</p>
            <p className="text-3xl font-bold text-[var(--accent)]">7.0</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-[20px] border border-slate-100">
            <p className="text-subheading text-[10px] uppercase tracking-widest mb-1 font-bold">Ударный режим</p>
            <p className="text-3xl font-bold">12<span className="text-sm ml-1 opacity-40">ДНЕЙ</span></p>
          </div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="card-modern bg-blue-600 border-none text-white p-6 relative overflow-hidden shadow-xl shadow-blue-500/10"
          onClick={onStartSession}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Zap size={100} className="text-white" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Следующая цель</p>
            </div>
            <h3 className="text-2xl font-bold mb-1 leading-tight tracking-tight">MAP INTERPRETATION</h3>
            <p className="text-blue-100 text-[13px] mb-6 font-medium opacity-90 max-w-[200px]">
              Секция 1: Освоение пространственной лексики и предлогов.
            </p>
            
            <button className="w-full py-3.5 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg">
              <Play size={16} fill="currentColor" />
              <span className="uppercase tracking-[0.1em] text-[10px]">Начать сессию</span>
            </button>
          </div>
        </motion.div>
      </header>

      {/* Learning Path */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-subheading text-[10px] uppercase tracking-[0.2em] font-bold">Ваш прогресс</h3>
          <TrendingUp size={16} className="text-[var(--muted)]" />
        </div>

        <div className="space-y-3">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              whileHover={{ x: 4 }}
              className="card-modern p-4 flex items-center gap-4 border-slate-100"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform", section.bg, section.color)}>
                <section.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="card-title text-[15px]">{section.title}</h4>
                  <span className="font-bold text-[10px] text-[var(--accent)]">{section.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${section.progress}%` }}
                    className="h-full bg-[var(--accent)]"
                  />
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-[var(--ink)] transition-colors" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom Nav */}
      <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto z-50">
        <nav className="h-16 bg-white/95 backdrop-blur-md border border-slate-200 rounded-[24px] flex items-center justify-around px-4 shadow-xl shadow-slate-200/40">
          <button className="p-3 text-[var(--accent)] relative group">
            <BookOpen size={22} strokeWidth={2.5} />
            <motion.div layoutId="nav-active" className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--accent)] rounded-full"></motion.div>
          </button>
          <button className="p-3 text-slate-400 hover:text-[var(--ink)] transition-all">
            <TrendingUp size={22} strokeWidth={2.5} />
          </button>
          <button className="p-3 text-slate-400 hover:text-[var(--ink)] transition-all">
            <Calendar size={22} strokeWidth={2.5} />
          </button>
          <button className="p-3 text-slate-400 hover:text-[var(--ink)] transition-all">
            <Settings size={22} strokeWidth={2.5} />
          </button>
        </nav>
      </div>
    </div>
  );
}
