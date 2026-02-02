'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();
  const router = useRouter();
  const supportedLangs: Language[] = ['en', 'id'];

  const getLangFromPath = (path: string): Language | null => {
    const seg = path.split('/')[1];
    return supportedLangs.includes(seg as Language) ? (seg as Language) : null;
  };

  const stripLangFromPath = (path: string): string => {
    const seg = path.split('/')[1];
    if (supportedLangs.includes(seg as Language)) {
      const rest = path.split('/').slice(2).join('/');
      return rest ? `/${rest}` : '/';
    }
    return path || '/';
  };

  const setLangCookie = (lang: Language) => {
    document.cookie = `lang=${lang};path=/`;
    document.cookie = `lang=${lang};path=/;domain=${window.location.hostname}`;
  };

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return defaultLanguage;
    const pathLang = getLangFromPath(window.location.pathname);
    if (pathLang) return pathLang;
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'id') return savedLanguage;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('id') ? 'id' : defaultLanguage;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Sync language from URL prefix
  useEffect(() => {
    const pathLang = pathname ? getLangFromPath(pathname) : null;
    if (pathLang && pathLang !== language) {
      setLanguageState(pathLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, pathLang);
      setLangCookie(pathLang);
    }
  }, [pathname, language]);

  // Save language preference when it changes and update URL
  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLangCookie(lang);

      const currentPath = window.location.pathname;
      const pathWithoutLang = stripLangFromPath(currentPath);
      const targetPath = pathWithoutLang === '/' ? `/${lang}` : `/${lang}${pathWithoutLang}`;
      if (currentPath !== targetPath) {
        router.push(targetPath);
      }
    },
    [router]
  );

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
