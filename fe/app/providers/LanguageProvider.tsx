'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Language, 
  Translations, 
  translations, 
  defaultLanguage, 
  LANGUAGE_STORAGE_KEY 
} from '@/app/i18n';

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguageState(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('id')) {
        setLanguageState('id');
      }
    }
    setIsLoading(false);
  }, []);

  // Save language preference when it changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    
    // Update document language attribute
    document.documentElement.lang = lang;
  }, []);

  // Memoized translations object
  const t = useMemo(() => translations[language], [language]);

  const value = useMemo(
    () => ({
      language,
      t,
      setLanguage,
      isLoading,
    }),
    [language, t, setLanguage, isLoading]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access language context
 * @returns {LanguageContextType} Language context with current language, translations, and setter
 * @throws {Error} If used outside of LanguageProvider
 * 
 * @example
 * const { language, t, setLanguage } = useLanguage();
 * 
 * // Access translations
 * <h1>{t.nav.home}</h1>
 * 
 * // Switch language
 * <button onClick={() => setLanguage('id')}>Switch to Indonesian</button>
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;
