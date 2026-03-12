import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vi from './locales/vi.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import km from './locales/km.json';

export const DEFAULT_LANGUAGE = 'vi';
export const SUPPORTED_LANGUAGE_CODES = ['vi', 'en', 'zh', 'km'];
export const LANGUAGE_STORAGE_KEY = 'heritage-language';
const LEGACY_LANGUAGE_STORAGE_KEY = 'i18nextLng';

const resources = {
  vi: { translation: vi },
  en: { translation: en },
  zh: { translation: zh },
  km: { translation: km },
};

const normalizeLanguageCode = (rawValue) => {
  if (!rawValue || typeof rawValue !== 'string') return null;
  const [languageOnly] = rawValue.trim().toLowerCase().split('-');
  return SUPPORTED_LANGUAGE_CODES.includes(languageOnly) ? languageOnly : null;
};

const migrateStoredLanguage = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  const currentStored = normalizeLanguageCode(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  if (currentStored) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentStored);
    localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
    return;
  }

  const legacyStored = normalizeLanguageCode(localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY));
  if (legacyStored) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, legacyStored);
    localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
  }
};

migrateStoredLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    cleanCode: true,
    defaultNS: 'translation',
    debug: import.meta.env.DEV,
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (lng, ns, key) => {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing key "${key}" in namespace "${ns}" for language "${lng}"`);
      }
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

export const languages = [
  { code: 'vi', name: 'Vietnamese', flag: 'VN', dir: 'ltr' },
  { code: 'en', name: 'English', flag: 'US', dir: 'ltr' },
  { code: 'zh', name: 'Traditional Chinese', flag: 'CN', dir: 'ltr' },
  { code: 'km', name: 'Khmer', flag: 'KH', dir: 'ltr' },
];

export const getCurrentLanguage = () => {
  const resolvedCode = normalizeLanguageCode(i18n.resolvedLanguage || i18n.language) || DEFAULT_LANGUAGE;
  return languages.find((lang) => lang.code === resolvedCode) || languages[0];
};

export const changeLanguage = (langCode) => {
  const normalized = normalizeLanguageCode(langCode) || DEFAULT_LANGUAGE;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
  }
  return i18n.changeLanguage(normalized);
};
