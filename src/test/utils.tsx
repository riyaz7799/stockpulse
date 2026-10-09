import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { Stock, StockDetailsData } from '../types';

export const stocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 230.5, change: 2.5, percentChange: 1.1 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 250, change: -3, percentChange: -1.2 },
];

export const details: StockDetailsData = {
  ...stocks[0],
  open: 228, high: 232, low: 227, previousClose: 228, volume: 45_000_000,
};

export function renderWithClient(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}
