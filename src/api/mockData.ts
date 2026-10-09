import type { HistoricalPoint, Stock, StockDetailsData } from '../types';

export const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', base: 230 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', base: 420 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', base: 175 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', base: 195 },
  { symbol: 'TSLA', name: 'Tesla Inc.', base: 250 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', base: 135 },
  { symbol: 'META', name: 'Meta Platforms Inc.', base: 560 },
  { symbol: 'NFLX', name: 'Netflix Inc.', base: 690 },
] as const;

const round2 = (n: number) => Math.round(n * 100) / 100;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const livePrices = new Map<string, number>();

const findBase = (symbol: string) =>
  POPULAR_STOCKS.find((s) => s.symbol === symbol.toUpperCase());

/** Deterministic PRNG so the historical series is stable per symbol. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function nextPrice(symbol: string, base: number) {
  const prev = livePrices.get(symbol) ?? base;
  const next = round2(prev * (1 + (Math.random() - 0.5) * 0.004));
  livePrices.set(symbol, next);
  return next;
}

function buildQuote(symbol: string): StockDetailsData {
  const meta = findBase(symbol);
  if (!meta) throw new Error(`Symbol "${symbol}" was not found`);
  const price = nextPrice(meta.symbol, meta.base);
  const previousClose = round2(meta.base * 0.995);
  const change = round2(price - previousClose);
  return {
    symbol: meta.symbol,
    name: meta.name,
    price,
    change,
    percentChange: round2((change / previousClose) * 100),
    open: round2(meta.base * 0.998),
    high: round2(Math.max(price, meta.base) * 1.006),
    low: round2(Math.min(price, meta.base) * 0.992),
    previousClose,
    volume: Math.round(20_000_000 + mulberry32(meta.base)() * 40_000_000),
  };
}

export async function mockPopularStocks(): Promise<Stock[]> {
  await delay(400);
  return POPULAR_STOCKS.map(({ symbol }) => {
    const { price, change, percentChange, name } = buildQuote(symbol);
    return { symbol, name, price, change, percentChange };
  });
}

export async function mockStockDetails(symbol: string): Promise<StockDetailsData> {
  await delay(250);
  return buildQuote(symbol);
}

export async function mockHistoricalData(symbol: string, days = 30): Promise<HistoricalPoint[]> {
  await delay(350);
  const meta = findBase(symbol);
  if (!meta) throw new Error(`Symbol "${symbol}" was not found`);
  const rand = mulberry32(symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const points: HistoricalPoint[] = [];
  let price = meta.base * 0.9;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    price = price * (1 + (rand() - 0.46) * 0.03);
    points.push({ date: d.toISOString().slice(0, 10), close: round2(price) });
  }
  return points;
}
