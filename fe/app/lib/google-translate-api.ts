/**
 * Translate API utility
 * Menggunakan MyMemory Translation API (free, no auth needed, no CORS)
 */

interface TranslateOptions {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslateResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

// Cache untuk menghindari request berulang
const translationCache = new Map<string, string>();

// Map language codes ke MyMemory format
const LANGUAGE_MAP: Record<string, string> = {
  'en': 'en',
  'id': 'id',
  'in': 'id',
};

/**
 * Translate text menggunakan MyMemory Translation API
 * Free API, tidak perlu auth, support CORS
 * Docs: https://mymemory.translated.net/doc/spec.php
 */
export async function translateText({
  text,
  targetLanguage,
  sourceLanguage = 'en',
}: TranslateOptions): Promise<TranslateResult> {
  // Jika target language sama dengan source, return as is
  if (targetLanguage === sourceLanguage || !text || text.trim().length === 0) {
    return { translatedText: text, detectedSourceLanguage: sourceLanguage };
  }

  // Check cache
  const cacheKey = `${sourceLanguage}-${targetLanguage}-${text}`;
  if (translationCache.has(cacheKey)) {
    return { translatedText: translationCache.get(cacheKey)!, detectedSourceLanguage: sourceLanguage };
  }

  try {
    const sourceLang = LANGUAGE_MAP[sourceLanguage] || sourceLanguage;
    const targetLang = LANGUAGE_MAP[targetLanguage] || targetLanguage;

    // Jika text mengandung HTML, strip tags untuk translate
    const hasHtml = /<[^>]*>/g.test(text);
    let textToTranslate = text;
    const htmlRegex = /<[^>]*>/g;
    const htmlTags: string[] = [];

    if (hasHtml) {
      // Extract HTML tags dan replace dengan placeholder
      htmlTags.push(...(text.match(htmlRegex) || []));
      textToTranslate = text.replace(htmlRegex, `[HTML${htmlTags.length - 1}]`);
    }

    // MyMemory API endpoint
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Ryu-PowerTools/1.0',
      },
    });

    if (!response.ok) {
      console.warn(`Translation API error: ${response.status}`);
      return { translatedText: text, detectedSourceLanguage: sourceLanguage };
    }

    const data = await response.json();

    // Parse MyMemory response
    let translatedText = text;
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      translatedText = data.responseData.translatedText;

      // Restore HTML tags
      if (hasHtml) {
        htmlTags.forEach((tag, i) => {
          translatedText = translatedText.replace(`[HTML${i}]`, tag);
        });
      }
    } else if (data.responseStatus === 403) {
      // Rate limit atau error dari API
      console.warn('Translation API rate limited or error');
      return { translatedText: text, detectedSourceLanguage: sourceLanguage };
    }

    // Cache result
    translationCache.set(cacheKey, translatedText);

    return {
      translatedText,
      detectedSourceLanguage: sourceLanguage,
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text jika ada error
    return { translatedText: text, detectedSourceLanguage: sourceLanguage };
  }
}

/**
 * Translate object properties secara recursive
 * Hanya string yang ditranslate
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  targetLanguage: string,
  sourceLanguage: string = 'en',
  fieldsToTranslate?: string[]
): Promise<T> {
  if (!obj || typeof obj !== 'object') return obj;

  const result: any = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in result) {
    // Skip jika fields ditentukan dan key bukan di list
    if (fieldsToTranslate && !fieldsToTranslate.includes(key)) {
      continue;
    }

    const value = result[key];

    if (typeof value === 'string' && value.trim().length > 0) {
      try {
        console.log(`📝 Translating field "${key}":`, value.substring(0, 50) + (value.length > 50 ? '...' : ''));
        const { translatedText } = await translateText({
          text: value,
          targetLanguage,
          sourceLanguage,
        });
        console.log(`✅ Translated "${key}":`, translatedText.substring(0, 50) + (translatedText.length > 50 ? '...' : ''));
        result[key] = translatedText;
        // Add small delay untuk avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error translating field ${key}:`, error);
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursive untuk nested objects
      result[key] = await translateObject(value, targetLanguage, sourceLanguage, fieldsToTranslate);
    } else if (Array.isArray(value)) {
      // Recursive untuk arrays
      result[key] = await Promise.all(
        value.map(async (item, idx) => {
          if (typeof item === 'string' && item.trim().length > 0) {
            const { translatedText } = await translateText({
              text: item,
              targetLanguage,
              sourceLanguage,
            });
            // Add small delay untuk avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            return translatedText;
          } else if (item && typeof item === 'object') {
            return translateObject(item, targetLanguage, sourceLanguage, fieldsToTranslate);
          }
          return item;
        })
      );
    }
  }

  return result;
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
}

/**
 * Get cache size (for debugging)
 */
export function getCacheSize() {
  return translationCache.size;
}
