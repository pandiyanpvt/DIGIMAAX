import { useLanguage } from '../context/LanguageContext';
import { formatLKR } from '../utils/currency';

/**
 * Hook to format currency using the current language from LanguageContext
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const useCurrency = () => {
  const { language } = useLanguage();
  
  return (amount) => formatLKR(amount, language);
};

