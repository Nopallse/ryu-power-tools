'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/app/providers/LanguageProvider';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslateProvider() {
  const { language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  const sourceLang = 'id';

  useEffect(() => {
    // Set cookie untuk pre-select language
    const setCookie = (lang: string) => {
      const value = `/${sourceLang}/${lang}`;
      document.cookie = `googtrans=${value};path=/`;
      document.cookie = `googtrans=${value};path=/;domain=${window.location.hostname}`;
    };

    setIsTranslating(true);
    setCookie(language);

    // Init Google Translate jika belum ada
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: sourceLang,
              includedLanguages: 'en,id',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    // Trigger translation setelah script load
    const timer = setTimeout(() => {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (select && select.value !== language) {
        select.value = language;
        select.dispatchEvent(new Event('change'));
      }
      
      // Hide loading after translation applied
      setTimeout(() => setIsTranslating(false), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [language]);

  // Remove banner Google Translate
  useEffect(() => {
    let cleaned = false;

    const removeBanner = () => {
      if (cleaned) return;
      
      try {
        // Remove iframe banner
        const frames = document.querySelectorAll('iframe.goog-te-banner-frame, .goog-te-banner-frame');
        frames.forEach(frame => {
          try {
            if (frame.parentNode) {
              frame.parentNode.removeChild(frame);
            }
          } catch (e) {
            // Ignore error if element already removed
          }
        });
        
        // Hide skiptranslate div
        const topDiv = document.querySelector('.skiptranslate') as HTMLElement;
        if (topDiv?.style) {
          topDiv.style.display = 'none';
        }
        
        // Reset body position
        document.body.style.top = '0';
        document.body.style.position = 'static';
      } catch (e) {
        // Silently ignore DOM errors
      }
    };

    // Run once on mount and then use MutationObserver for efficiency
    removeBanner();

    const observer = new MutationObserver(() => {
      removeBanner();
    });

    // Observe body for new Google Translate elements
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cleaned = true;
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        id="google_translate_element"
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
 
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

