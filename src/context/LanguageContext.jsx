import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext(null);

export const availableLanguages = [
  { code: 'en', label: 'English', nativeName: 'English', greeting: 'Hello' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', greeting: 'नमस्ते' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', greeting: 'नमस्कार' }
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('kisan_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('kisan_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = (key, fallback = '') => {
    if (!translations[language] || !(key in translations[language])) {
      return translations['en']?.[key] || fallback || key;
    }
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
