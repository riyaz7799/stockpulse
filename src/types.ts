export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
}

export interface StockDetailsData extends Stock {
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
}

export interface HistoricalPoint {
  date: string;
  close: number;
}

export type Theme = 'light' | 'dark';
