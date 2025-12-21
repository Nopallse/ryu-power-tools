import en from './locales/en';
import id from './locales/id';

export type Language = 'en' | 'id';

export type Translations = typeof en;

export const translations: Record<Language, Translations> = {
  en,
  id,
};

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '/images/flags/uk.png' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '/images/flags/indonesia.png' },
];

export const defaultLanguage: Language = 'en';

// Storage key for persisting language preference
export const LANGUAGE_STORAGE_KEY = 'ryu-language';
