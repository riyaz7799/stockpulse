export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export const formatChange = (change: number, percent: number) => {
  const sign = change > 0 ? '+' : change < 0 ? '−' : '';
  return `${sign}${Math.abs(change).toFixed(2)} (${sign}${Math.abs(percent).toFixed(2)}%)`;
};

export const formatVolume = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export const trendOf = (change: number): 'up' | 'down' | 'flat' =>
  change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
