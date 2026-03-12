'use client';

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
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
  const adminLanguage: Language = 'en';

  const isAdminPath = (path: string): boolean => {
    return /^\/(admin|log8i8n738)(?:\/|$)/.test(path) || /^\/(en|id)\/(admin|log8i8n738)(?:\/|$)/.test(path);
  };

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
    if (isAdminPath(window.location.pathname)) return adminLanguage;
    const pathLang = getLangFromPath(window.location.pathname);
    if (pathLang) return pathLang;
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'id') return savedLanguage;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('id') ? 'id' : defaultLanguage;
  });
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    if (pathname && isAdminPath(pathname)) {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('translate', 'no');
      document.documentElement.classList.add('notranslate');
      document.body.setAttribute('translate', 'no');
      document.body.classList.add('notranslate');

      let meta = document.querySelector('meta[name="google"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', 'notranslate');

      // Clear googtrans cookie to prevent Google Translate widget from translating
      document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = `googtrans=;path=/;domain=${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      return;
    }

    document.documentElement.lang = language;
    document.documentElement.removeAttribute('translate');
    document.documentElement.classList.remove('notranslate');
    document.body.removeAttribute('translate');
    document.body.classList.remove('notranslate');

    const meta = document.querySelector('meta[name="google"]') as HTMLMetaElement | null;
    if (meta) {
      meta.setAttribute('content', 'translate');
    }
  }, [language, pathname]);

  // Sync language from URL prefix
  useEffect(() => {
    if (!pathname) return;

    if (isAdminPath(pathname)) {
      if (language !== adminLanguage) {
        setLanguageState(adminLanguage);
      }
      return;
    }

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
      const currentPath = window.location.pathname;

      if (isAdminPath(currentPath)) {
        setLanguageState(adminLanguage);
        return;
      }

      setLanguageState(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLangCookie(lang);

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
