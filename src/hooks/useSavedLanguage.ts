import { useState, useEffect } from 'react';
import { Language } from '../types';

const STORAGE_KEY = 'aarambh_selected_language';
const VALID_LANGUAGES: Language[] = ['en', 'hi', 'te', 'ta', 'kn', 'bn', 'mr', 'gu'];

/**
 * Custom React hook that persists the user's selected regional language
 * to localStorage so it is remembered upon return visits.
 */
export function useSavedLanguage(defaultLang: Language = 'en'): [Language, (newLang: Language) => void] {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored && VALID_LANGUAGES.includes(stored as Language)) {
        return stored as Language;
      }
    } catch {
      // localStorage blocked or restricted
    }
    return defaultLang;
  });

  const setLang = (newLang: Language) => {
    if (!VALID_LANGUAGES.includes(newLang)) return;
    setLangState(newLang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newLang);
      }
    } catch {
      // handle storage errors gracefully
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && VALID_LANGUAGES.includes(e.newValue as Language)) {
        setLangState(e.newValue as Language);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return [lang, setLang];
}
