import { useState, useCallback } from 'react';
import { UIState, UIActions, ThemeMode } from '../types';

export function useUI(): UIState & UIActions {
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Theme mode state with localStorage persistence
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  const showMessage = useCallback((text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  }, []);

  return {
    showSettings,
    setShowSettings,
    message,
    messageType,
    showMessage,
    themeMode,
    toggleTheme,
  };
}
