import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, fetchHistoricalData, fetchPopularStocks, fetchStockDetails } from './stockService';

const quote = (symbol: string) => ({
  symbol, name: `${symbol} Corp`, open: '10', high: '12', low: '9', close: '11',
  volume: '1000', previous_close: '10', change: '1', percent_change: '10',
});
const mockFetch = (body: unknown, ok = true, status = 200) =>
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, status, json: async () => body }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('stockService (mock mode)', () => {
  it('returns mock data when no API key is set', async () => {
    vi.stubEnv('VITE_STOCK_API_KEY', '');
    const list = await fetchPopularStocks();
    expect(list.length).toBeGreaterThan(0);
    const d = await fetchStockDetails('AAPL');
    expect(d.symbol).toBe('AAPL');
    const h = await fetchHistoricalData('AAPL');
    expect(h).toHaveLength(30);
  });

  it('rejects unknown symbols', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    await expect(fetchStockDetails('ZZZZ')).rejects.toThrow(/not found/);
    await expect(fetchHistoricalData('ZZZZ')).rejects.toThrow(/not found/);
  });
});

describe('stockService (live mode)', () => {
  const live = () => {
    vi.stubEnv('VITE_STOCK_API_KEY', 'key');
    vi.stubEnv('VITE_USE_MOCK', 'false');
  };

  it('parses a batch quote response', async () => {
    live();
    mockFetch({ AAPL: quote('AAPL'), MSFT: quote('MSFT'), BAD: { status: 'error' } });
    const list = await fetchPopularStocks();
    expect(list.map((s) => s.symbol)).toEqual(['AAPL', 'MSFT']);
    expect(list[0].price).toBe(11);
  });

  it('throws when the batch has no usable data', async () => {
    live();
    mockFetch({ BAD: { status: 'error' } });
    await expect(fetchPopularStocks()).rejects.toThrow(/No stock data/);
  });

  it('parses details', async () => {
    live();
    mockFetch(quote('AAPL'));
    const d = await fetchStockDetails('AAPL');
    expect(d).toMatchObject({ symbol: 'AAPL', open: 10, previousClose: 10, volume: 1000 });
  });

  it('returns history oldest-first', async () => {
    live();
    mockFetch({ values: [{ datetime: '2026-01-02', close: '2' }, { datetime: '2026-01-01', close: '1' }] });
    const h = await fetchHistoricalData('AAPL');
    expect(h.map((p) => p.date)).toEqual(['2026-01-01', '2026-01-02']);
  });

  it('throws on empty history', async () => {
    live();
    mockFetch({ values: [] });
    await expect(fetchHistoricalData('AAPL')).rejects.toThrow(/No historical data/);
  });

  it('maps rate-limit errors to a friendly message', async () => {
    live();
    mockFetch({ status: 'error', code: 429, message: 'limit' });
    await expect(fetchStockDetails('AAPL')).rejects.toThrow(/rate limit/i);
  });

  it('surfaces API error messages', async () => {
    live();
    mockFetch({ status: 'error', code: 400, message: 'Bad symbol' });
    await expect(fetchStockDetails('AAPL')).rejects.toThrow('Bad symbol');
  });

  it('throws ApiError on HTTP failure', async () => {
    live();
    mockFetch({}, false, 500);
    await expect(fetchStockDetails('AAPL')).rejects.toBeInstanceOf(ApiError);
  });

  it('throws a network error when fetch rejects', async () => {
    live();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(fetchStockDetails('AAPL')).rejects.toThrow(/Network error/);
  });
});
