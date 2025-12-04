export const formatLKR = (amount, locale = 'en') => {
  try {
    const formatter = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', { 
      style: 'currency', 
      currency: 'EUR', 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    return formatter.format(Math.max(0, amount || 0));
  } catch {
    const localeString = locale === 'fr' ? 'fr-FR' : 'en-US';
    return `€${Math.max(0, amount || 0).toLocaleString(localeString, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};


