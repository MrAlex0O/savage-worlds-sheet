import { en } from './en';
import { ru } from './ru';
import { Language } from '../types/character';
export type TranslationKey = keyof typeof en;
type Section = keyof typeof en;
type Keys<T extends Section> = keyof (typeof en)[T];
type TranslationValue = string;

const translations = {
  en,
  ru,
} as const;

export const STORAGE_KEY_LANG = 'savageWorldsLanguage';

export const getStoredLanguage = (): Language => {
  const storedLang = localStorage.getItem(STORAGE_KEY_LANG);
  return (storedLang as Language) || 'en';
};

export const setStoredLanguage = (lang: Language): void => {
  localStorage.setItem(STORAGE_KEY_LANG, lang);
};

export const t = <S extends Section>(lang: Language, section: S, key: Keys<S>): TranslationValue => {
  const value = translations[lang]?.[section]?.[key] ?? translations.en[section][key];
  return value as TranslationValue;
};

export const getLanguages = (): { code: Language; name: string }[] => [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
]; 