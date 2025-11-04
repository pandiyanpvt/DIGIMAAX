export const formatLKR = (amount) => {
  try {
    const formatter = new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 });
    return formatter.format(Math.max(0, Math.round(amount || 0)));
  } catch {
    return `LKR ${Math.max(0, Math.round(amount || 0)).toLocaleString('en-LK')}`;
  }
};


