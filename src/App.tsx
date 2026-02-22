/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Login from './screens/Login';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import LearningSession from './screens/LearningSession';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; 
import { auth, db } from './firebase'; 
import MockExam from './screens/MockExam';

interface UserData {
  name: string;
  score: number;
  streak: number;
}

function AppContent() {
  const [isLight, setIsLight] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme !== 'dark';
  });

  const [userData, setUserData] = useState<UserData>({ name: '', score: 0, streak: 0 });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Применение темы
  useEffect(() => {
    const root = window.document.documentElement;
    if (!isLight) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isLight]);

  // Синхронизация с Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentPath = window.location.pathname;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        let finalData = {
          name: user.displayName || 'Студент',
          score: 0,
          streak: 0,
          hasCompletedOnboarding: false
        };

        if (userSnap.exists()) {
          const dbData = userSnap.data();
          finalData = {
            name: dbData.name || user.displayName || 'Студент',
            score: dbData.score || 0,
            streak: dbData.streak || 0,
            hasCompletedOnboarding: dbData.hasCompletedOnboarding || false
          };
        } else {
          await setDoc(userRef, {
            name: finalData.name,
            email: user.email,
            score: 0,
            streak: 0,
            hasCompletedOnboarding: false,
            createdAt: new Date()
          });
        }

        setUserData({ 
          name: finalData.name,
          score: finalData.score,
          streak: finalData.streak
        });

        if (finalData.hasCompletedOnboarding) {
          if (currentPath === '/login' || currentPath === '/') {
            navigate('/dashboard', { replace: true });
          }
        } else {
          if (currentPath !== '/onboarding') {
            navigate('/onboarding', { replace: true });
          }
        }
      } else {
        if (currentPath !== '/login') {
          navigate('/login', { replace: true });
        }
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleTheme = () => setIsLight(prev => !prev);

  // ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ИМЕНИ ИЗ DASHBOARD
  const handleUpdateName = (newName: string) => {
    setUserData(prev => ({ ...prev, name: newName }));
  };

  const handleLogin = (user: any) => {
    setUserData(prev => ({ ...prev, name: user?.displayName || 'Студент' }));
  };

  const handleOnboardingComplete = async (data: any) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const nameToSave = data.name || userData.name;
      
      handleUpdateName(nameToSave);
      
      await updateDoc(userRef, {
        hasCompletedOnboarding: true,
        name: nameToSave
      });
    }
    navigate('/dashboard');
  };

  const handleStartSession = () => navigate('/session');
  const handleExitSession = () => navigate('/dashboard');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] transition-colors duration-300">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
        <Route path="/dashboard/*" element={
          <Dashboard 
            onStartSession={handleStartSession} 
            isLight={isLight} 
            onToggleTheme={toggleTheme}
            userName={userData.name}
            setUserName={handleUpdateName} // ПЕРЕДАЕМ ФУНКЦИЮ ОБНОВЛЕНИЯ
            score={userData.score}
            streak={userData.streak}
            onLogout={handleLogout} 
          />
        } />
        <Route path="/session" element={<LearningSession onExit={handleExitSession} />} />
        <Route path="/exam" element={<MockExam />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}