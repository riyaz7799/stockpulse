import type { HistoricalPoint, Stock, StockDetailsData } from '../types';
import { POPULAR_STOCKS, mockHistoricalData, mockPopularStocks, mockStockDetails } from './mockData';

const BASE_URL = 'https://api.twelvedata.com';

export class ApiError extends Error {
  code?: number;
  constructor(message: string, code?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/** Evaluated per call so it can be toggled in tests. Falls back to mock data without a key. */
const useMock = () =>
  import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_STOCK_API_KEY;

interface TwelveQuote {
  symbol: string;
  name: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  status?: string;
  message?: string;
  code?: number;
}

async function request<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams({ ...params, apikey: import.meta.env.VITE_STOCK_API_KEY });
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}?${qs.toString()}`);
  } catch {
    throw new ApiError('Network error. Please check your connection.');
  }
  if (!res.ok) throw new ApiError(`Request failed (HTTP ${res.status})`, res.status);
  const data = await res.json();
  if (data?.status === 'error') {
    const message =
      data.code === 429
        ? 'API rate limit reached. Data will refresh shortly.'
        : (data.message ?? 'The stock API returned an error.');
    throw new ApiError(message, data.code);
  }
  return data as T;
}

const num = (v: string | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const toStock = (q: TwelveQuote): Stock => ({
  symbol: q.symbol,
  name: q.name,
  price: num(q.close),
  change: num(q.change),
  percentChange: num(q.percent_change),
});

export const toDetails = (q: TwelveQuote): StockDetailsData => ({
  ...toStock(q),
  open: num(q.open),
  high: num(q.high),
  low: num(q.low),
  previousClose: num(q.previous_close),
  volume: num(q.volume),
});

export async function fetchPopularStocks(): Promise<Stock[]> {
  if (useMock()) return mockPopularStocks();
  const symbols = POPULAR_STOCKS.map((s) => s.symbol).join(',');
  const data = await request<Record<string, TwelveQuote>>('/quote', { symbol: symbols });
  const quotes = Object.values(data).filter((q) => q && q.status !== 'error' && q.close);
  if (quotes.length === 0) throw new ApiError('No stock data available right now.');
  return quotes.map(toStock);
}

export async function fetchStockDetails(symbol: string): Promise<StockDetailsData> {
  if (useMock()) return mockStockDetails(symbol);
  return toDetails(await request<TwelveQuote>('/quote', { symbol }));
}

export async function fetchHistoricalData(symbol: string): Promise<HistoricalPoint[]> {
  if (useMock()) return mockHistoricalData(symbol);
  const data = await request<{ values?: { datetime: string; close: string }[] }>('/time_series', {
    symbol,
    interval: '1day',
    outputsize: '30',
  });
  if (!data.values?.length) throw new ApiError('No historical data available.');
  // API returns newest first; charts want oldest first.
  return data.values.map((v) => ({ date: v.datetime, close: num(v.close) })).reverse();
}
