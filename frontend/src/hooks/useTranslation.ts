// hooks/useTranslation.ts
import { useSettings } from '../context/SettingsContext';
import { translations } from '../i18n/translations';

type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.ru;
console.log('useTranslation')
export const useTranslation = () => {
  const { language } = useSettings();
  const currentLang = language as Language;
  const t = (key: TranslationKey) => {
    return translations[currentLang][key];
  };
  return { t, language };
};