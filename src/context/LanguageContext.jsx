import { createContext, useContext, useState, useEffect } from 'react';
import i18n, {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGE_CODES,
  languages,
} from '../i18n';

const LanguageContext = createContext(null);
const LEGACY_LANGUAGE_STORAGE_KEY = 'i18nextLng';

const normalizeLanguageCode = (rawValue) => {
  if (!rawValue || typeof rawValue !== 'string') return null;
  const [languageOnly] = rawValue.trim().toLowerCase().split('-');
  return SUPPORTED_LANGUAGE_CODES.includes(languageOnly) ? languageOnly : null;
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const saved = normalizeLanguageCode(localStorage.getItem(LANGUAGE_STORAGE_KEY));
  if (saved) return saved;

  const legacySaved = normalizeLanguageCode(localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY));
  if (legacySaved) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, legacySaved);
    localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
    return legacySaved;
  }

  const browserLang = normalizeLanguageCode(navigator.language);
  return browserLang || DEFAULT_LANGUAGE;
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    const normalizedLanguage = normalizeLanguageCode(currentLanguage) || DEFAULT_LANGUAGE;

    i18n.changeLanguage(normalizedLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    document.documentElement.lang = normalizedLanguage;

    const langConfig = languages.find((lang) => lang.code === normalizedLanguage);
    document.documentElement.dir = langConfig?.dir || 'ltr';
  }, [currentLanguage]);

  const changeLanguage = (langCode) => {
    const normalizedLanguage = normalizeLanguageCode(langCode);
    if (normalizedLanguage) {
      setCurrentLanguage(normalizedLanguage);
    }
  };

  const getCurrentLanguageInfo = () => {
    return languages.find((lang) => lang.code === currentLanguage) || languages[0];
  };

  const value = {
    currentLanguage,
    changeLanguage,
    languages,
    getCurrentLanguageInfo,
    t: i18n.t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
