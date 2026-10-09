import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchHistoricalData, fetchPopularStocks, fetchStockDetails } from '../api/stockService';

const pollMs = Number(import.meta.env.VITE_POLL_INTERVAL_MS) || 10_000;

export const stockKeys = {
  popular: ['stocks', 'popular'] as const,
  details: (symbol: string) => ['stocks', 'details', symbol] as const,
  history: (symbol: string) => ['stocks', 'history', symbol] as const,
};

/** Popular list: cached for 60s (stale-while-revalidate) to respect free-tier rate limits. */
export function usePopularStocks() {
  return useQuery({
    queryKey: stockKeys.popular,
    queryFn: fetchPopularStocks,
    staleTime: 60_000,
  });
}

/** Selected stock quote: polled for near real-time price updates. */
export function useStockDetails(symbol: string | null) {
  return useQuery({
    queryKey: stockKeys.details(symbol ?? ''),
    queryFn: () => fetchStockDetails(symbol as string),
    enabled: !!symbol,
    refetchInterval: pollMs,
    staleTime: pollMs / 2,
    placeholderData: keepPreviousData,
  });
}

/** Historical series changes rarely, so cache it for 5 minutes. */
export function useHistoricalData(symbol: string | null) {
  return useQuery({
    queryKey: stockKeys.history(symbol ?? ''),
    queryFn: () => fetchHistoricalData(symbol as string),
    enabled: !!symbol,
    staleTime: 5 * 60_000,
  });
}
