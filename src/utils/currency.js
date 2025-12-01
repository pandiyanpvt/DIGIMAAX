export const formatLKR = (amount) => {
  try {
    const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatter.format(Math.max(0, amount || 0));
  } catch {
    return `€${Math.max(0, amount || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};


