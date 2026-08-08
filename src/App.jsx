import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppRoutes theme={theme} toggleTheme={toggleTheme} />
  );
}
