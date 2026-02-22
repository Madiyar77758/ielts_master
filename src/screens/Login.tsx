// src/screens/Login.tsx
import React from 'react';
import { motion } from 'motion/react';
import { Chrome, Apple } from 'lucide-react';
// Импортируем Firebase
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../firebase';

export default function Login({ onLogin }: { onLogin: (userData?: any) => void }) {
  
  // Функция входа через Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Успешный вход Google! Пользователь:", result.user.displayName);
      // Передаем пользователя в App.tsx
      onLogin(result.user);
    } catch (error) {
      console.error("Ошибка при входе через Google:", error);
      alert("Не удалось войти через Google. Попробуй еще раз.");
    }
  };

  // Функция входа через Apple
  const handleAppleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      console.log("Успешный вход Apple! Пользователь:", result.user.displayName);
      onLogin(result.user);
    } catch (error) {
      console.error("Ошибка при входе через Apple:", error);
      alert("Не удалось войти через Apple.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex justify-center"
        >
          <div className="w-20 h-20 bg-[var(--accent)] rounded-[28px] flex items-center justify-center shadow-xl shadow-blue-500/20 relative">
            <div className="absolute inset-0 bg-blue-400/20 rounded-[28px] blur-lg animate-pulse"></div>
            <span className="text-white font-black text-4xl relative z-10">i</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-heading text-[32px] mb-3">
            IELTS MASTER
          </h1>
          <p className="text-subheading text-[17px] mb-12">
            Ваш персональный путь к <br />
            <span className="text-[var(--ink)] font-bold">высокому баллу.</span>
          </p>
        </motion.div>

        <div className="space-y-3 w-full">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-[var(--border)] rounded-2xl group transition-all hover:border-slate-300 cursor-pointer"
          >
            <Chrome size={20} className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
            <span className="font-bold text-[16px] text-[var(--ink)]">Войти через Google</span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 bg-[var(--ink)] text-white rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/10 cursor-pointer"
          >
            <Apple size={20} fill="currentColor" />
            <span className="text-[16px]">Войти через Apple</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}