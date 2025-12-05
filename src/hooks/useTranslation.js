import { useLanguage } from '../context/LanguageContext';
import { translations as enTranslations } from '../translations/en';
import { translations as frTranslations } from '../translations/fr';

const translationFiles = {
  en: enTranslations,
  fr: frTranslations,
};

/**
 * Hook to access translations
 * @param {string} key - Translation key in dot notation (e.g., 'nav.home')
 * @param {object} params - Optional parameters for string interpolation
 * @returns {string} Translated string
 */
export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key, params = {}) => {
    const translations = translationFiles[language] || translationFiles.en;
    
    // Navigate through nested object using dot notation
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        const enValue = translationFiles.en;
        let enTranslation = enValue;
        for (const enKey of keys) {
          if (enTranslation && typeof enTranslation === 'object' && enKey in enTranslation) {
            enTranslation = enTranslation[enKey];
          } else {
            return key; // Return key if not found in any language
          }
        }
        return typeof enTranslation === 'string' ? enTranslation : key;
      }
    }

    // Handle string interpolation if params are provided
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};

