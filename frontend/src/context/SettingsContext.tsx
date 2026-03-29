// SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type Language = 'ru' | 'en';

interface SettingsContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Загрузка настроек из localStorage при старте
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });
  
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  // Сохранение в localStorage и применение к body при изменении
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Удаление предыдущих классов темы
    document.body.classList.remove('theme-light', 'theme-dark');
    // Добавление новых классов
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    // Смена языка приложения
    document.documentElement.lang = language;
    
    // Отдельное свойство для заголовка "время" в календаре
    document.documentElement.style.setProperty(
      '--time-label', 
      language === 'ru' ? '"время"' : '"Time"'
    );
  }, [language]);

  return (
    <SettingsContext.Provider value={{ theme, language, setTheme, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};