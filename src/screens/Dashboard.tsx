import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '../utils/cn';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function Dashboard({ 
  onStartSession, 
  isLight, 
  onToggleTheme, 
  userName,
  setUserName,
  score,
  streak,
  onLogout 
}: { 
  onStartSession: () => void; 
  isLight: boolean; 
  onToggleTheme: () => void;
  userName: string;
  setUserName: (name: string) => void;
  score: number;
  streak: number;
  onLogout: () => void; 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [newName, setNewName] = useState(userName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNewName(userName);
  }, [userName]);

  const sections = [
    { id: 'listening', title: 'Listening', icon: Headphones, progress: 65, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'reading', title: 'Reading', icon: BookOpen, progress: 40, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'writing', title: 'Writing', icon: PenTool, progress: 20, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'speaking', title: 'Speaking', icon: Mic2, progress: 10, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const handleSaveName = async () => {
    if (!auth.currentUser || isSaving || !newName.trim()) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name: newName.trim() });
      
      setUserName(newName.trim());
      alert("Настройки сохранены!");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Ошибка при сохранении.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderHome = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <header className="px-6 pt-12 pb-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={24} className="text-white fill-white/20" />
            </div>
            <div>
              <h2 className="text-heading">{userName}</h2>
              <p className="text-subheading">Уровень 12 • Pro</p>
            </div>
          </div>
          <button 
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-full bg-[var(--card-bg)] flex items-center justify-center transition-all border border-[var(--border)] text-[var(--ink)]"
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card-modern">
            <p className="text-subheading mb-1">Текущий балл</p>
            <p className="text-3xl font-bold text-[var(--accent)]">{score > 0 ? score.toFixed(1) : "0.0"}</p>
          </div>
          <div className="card-modern">
            <p className="text-subheading mb-1">Ударный режим</p>
            <p className="text-3xl font-bold text-[var(--ink)]">{streak}<span className="text-sm ml-1 opacity-40 uppercase">дней</span></p>
          </div>
        </div>

        {/* НОВАЯ КНОПКА: ПРОБНЫЙ ЭКЗАМЕН */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/exam')}
          className="w-full mb-8 py-4 px-6 bg-[var(--card-bg)] border-2 border-dashed border-[var(--accent)] rounded-[24px] flex items-center justify-between text-[var(--ink)] group hover:bg-[var(--accent)] transition-all overflow-hidden relative"
        >
          <div className="flex flex-col items-start z-10 relative text-left">
            <span className="font-bold text-lg group-hover:text-white transition-colors">Сдать Mock Exam</span>
            <span className="text-[12px] opacity-70 font-medium group-hover:text-white/80 transition-colors">Узнай свой точный балл IELTS</span>
          </div>
          <ChevronRight size={24} className="text-[var(--accent)] group-hover:text-white z-10 relative transition-colors" />
        </motion.button>

        {/* ЖЕЛЕЗОБЕТОННАЯ КАРТОЧКА */}
        <motion.div 
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="bg-[#2563eb] text-white border-none rounded-[24px] p-6 relative overflow-hidden shadow-xl shadow-blue-500/20 cursor-pointer"
          onClick={onStartSession}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 text-white"><Zap size={100} /></div>
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-2 mb-3 text-white/90">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              <p className="text-[10px] uppercase tracking-widest font-bold">Следующая цель</p>
            </div>
            <h3 className="text-2xl font-bold mb-1 leading-tight tracking-tight text-white">MAP INTERPRETATION</h3>
            <p className="text-white/90 text-[13px] mb-6 font-medium max-w-[200px]">
              Секция 1: Освоение пространственной лексики и предлогов.
            </p>
            <div className="w-full py-3.5 bg-white text-[#2563eb] hover:bg-blue-50 transition-colors rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg">
              <Play size={16} fill="currentColor" />
              <span className="uppercase tracking-[0.1em] text-[10px]">Начать сессию</span>
            </div>
          </div>
        </motion.div>
      </header>

      <section className="px-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-subheading">Ваш прогресс</h3>
          <TrendingUp size={16} className="text-[var(--muted)]" />
        </div>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="card-modern p-4 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", section.bg, section.color)}>
                <section.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="card-title !text-[15px]">{section.title}</h4>
                  <span className="font-bold text-[10px] text-[var(--accent)]">{section.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${section.progress}%` }} className="h-full bg-[var(--accent)] transition-all duration-1000" />
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 opacity-50" />
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );

  const renderStats = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-6 pt-12">
      <h2 className="text-heading text-3xl mb-4">Статистика</h2>
      <div className="card-modern p-6 text-center">
        <TrendingUp size={48} className="mx-auto text-blue-400 mb-4 opacity-50" />
        <p className="card-desc">Здесь скоро появятся красивые графики ваших успехов.</p>
      </div>
    </motion.div>
  );

  const renderCalendar = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-6 pt-12">
      <h2 className="text-heading text-3xl mb-4">Расписание</h2>
      <div className="card-modern p-6 text-center">
        <Calendar size={48} className="mx-auto text-emerald-400 mb-4 opacity-50" />
        <p className="card-desc">Здесь будет ваш план подготовки к экзамену.</p>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="px-6 pt-12">
      <h2 className="text-heading text-3xl mb-8">Настройки</h2>
      <div className="card-modern p-5 mb-6">
        <p className="text-subheading mb-3">Профиль</p>
        <div className="mb-4">
          <label className="text-xs text-[var(--muted)] mb-1 block">Ваше имя</label>
          <input 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] transition-colors text-[var(--ink)]"
          />
        </div>
        <button 
          onClick={handleSaveName}
          disabled={isSaving}
          className="btn-primary w-full py-3 text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          {isSaving ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </div>
      <button onClick={onLogout} className="w-full py-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
        <LogOut size={20} />
        Выйти из аккаунта
      </button>
    </motion.div>
  );

  const navItems = [
    { id: 'home', path: '/dashboard', icon: BookOpen },
    { id: 'stats', path: '/dashboard/stats', icon: TrendingUp },
    { id: 'calendar', path: '/dashboard/calendar', icon: Calendar },
    { id: 'settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] pb-36 max-w-md mx-auto overflow-x-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {currentPath.includes('/settings') ? renderSettings() :
         currentPath.includes('/stats') ? renderStats() :
         currentPath.includes('/calendar') ? renderCalendar() : 
         renderHome()}
      </AnimatePresence>
      <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto z-50">
        <nav className="h-16 bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--border)] rounded-[24px] flex items-center justify-around px-4 shadow-xl shadow-black/10">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.id === 'home' && currentPath === '/dashboard');
            return (
              <button key={item.id} onClick={() => navigate(item.path)} className={cn("p-3 relative group transition-colors duration-300", isActive ? "text-[var(--accent)]" : "text-slate-400 hover:text-[var(--ink)]")}>
                <item.icon size={22} strokeWidth={2.5} />
                {isActive && (
                  <motion.div layoutId="nav-active" className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}