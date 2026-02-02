'use client';

import { useEffect, useState, useRef } from 'react';
import { translateObject } from '@/app/lib/google-translate-api';
import type { Language } from '@/app/i18n';

/**
 * Hook untuk translate data dinamis dari database
 * - Statis: gunakan i18n
 * - Dinamis (dari DB): gunakan Google Translate
 *
 * Usage:
 * const { translated: translatedProduct, isLoading } = useTranslatedData(product, language);
 */
export function useTranslatedData<T extends Record<string, any>>(
  data: T | null | undefined,
  targetLanguage: Language,
  fieldsToTranslate?: string[]
) {
  const [translated, setTranslated] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousDataRef = useRef<T | null>(null);
  const previousLanguageRef = useRef<Language>(targetLanguage);

  useEffect(() => {
    if (!data) {
      setTranslated(null);
      return;
    }

    // Jika data atau language tidak berubah, skip
    if (
      previousDataRef.current === data &&
      previousLanguageRef.current === targetLanguage
    ) {
      return;
    }

    // Jika target language English, gunakan data original
    if (targetLanguage === 'en') {
      setTranslated(data);
      previousDataRef.current = data;
      previousLanguageRef.current = targetLanguage;
      return;
    }

    const performTranslation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`🔄 Translating to ${targetLanguage}, fields:`, fieldsToTranslate);
        const result = await translateObject(
          data,
          targetLanguage,
          'en',
          fieldsToTranslate
        );
        console.log(`✅ Translation complete for ${targetLanguage}`, result);
        setTranslated(result);
        previousDataRef.current = data;
        previousLanguageRef.current = targetLanguage;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Translation error';
        console.error(`❌ Translation error:`, errorMessage);
        setError(errorMessage);
        // Fallback ke data original jika error
        setTranslated(data);
      } finally {
        setIsLoading(false);
      }
    };

    performTranslation();
  }, [data, targetLanguage, fieldsToTranslate]);

  return {
    translated,
    isLoading,
    error,
  };
}
