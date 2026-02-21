/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { cn } from './utils/cn';
import Login from './screens/Login';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import LearningSession from './screens/LearningSession';

type AppState = 'login' | 'onboarding' | 'dashboard' | 'session';

export default function App() {
  const [state, setState] = useState<AppState>('login');
  const [isLight, setIsLight] = useState(true);
  const [userData, setUserData] = useState({ name: 'Alex' });

  const toggleTheme = () => {
    setIsLight(!isLight);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = () => {
    setState('onboarding');
  };

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding data:', data);
    setUserData({ name: data.name });
    setState('dashboard');
  };

  const handleStartSession = () => {
    setState('session');
  };

  const handleExitSession = () => {
    setState('dashboard');
  };

  return (
    <div className={cn("min-h-screen", !isLight ? "dark" : "")}>
      {state === 'login' && <Login onLogin={handleLogin} />}
      {state === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
      {state === 'dashboard' && (
        <Dashboard 
          onStartSession={handleStartSession} 
          isLight={isLight} 
          onToggleTheme={toggleTheme}
          userName={userData.name}
        />
      )}
      {state === 'session' && <LearningSession onExit={handleExitSession} />}
    </div>
  );
}


