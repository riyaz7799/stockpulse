import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../api/stockService';
import App from '../App';
import { useUiStore } from '../stores/uiStore';
import { details, renderWithClient, stocks } from '../test/utils';

vi.mock('../api/stockService');
vi.mock('../components/PriceChart', () => ({ default: () => <div>chart</div> }));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useUiStore.setState({ selectedStockSymbol: null, theme: 'light' });
    vi.mocked(api.fetchStockDetails).mockResolvedValue(details);
    vi.mocked(api.fetchHistoricalData).mockResolvedValue([{ date: '2026-01-01', close: 1 }]);
  });

  it('shows a skeleton, then the list', async () => {
    vi.mocked(api.fetchPopularStocks).mockResolvedValue(stocks);
    renderWithClient(<App />);
    expect(screen.getByLabelText(/loading stocks/i)).toBeInTheDocument();
    expect(await screen.findByText('AAPL')).toBeInTheDocument();
  });

  it('shows an error with retry', async () => {
    vi.mocked(api.fetchPopularStocks).mockRejectedValueOnce(new Error('API down')).mockResolvedValue(stocks);
    renderWithClient(<App />);
    expect(await screen.findByText('API down')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText('AAPL')).toBeInTheDocument();
  });

  it('filters the list and selects a stock', async () => {
    vi.mocked(api.fetchPopularStocks).mockResolvedValue(stocks);
    renderWithClient(<App />);
    await screen.findByText('AAPL');
    await userEvent.type(screen.getByLabelText(/search stocks/i), 'tesla');
    expect(screen.queryByText('AAPL')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /TSLA/ }));
    expect(useUiStore.getState().selectedStockSymbol).toBe('TSLA');
  });

  it('toggles the theme', async () => {
    vi.mocked(api.fetchPopularStocks).mockResolvedValue(stocks);
    renderWithClient(<App />);
    await userEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
