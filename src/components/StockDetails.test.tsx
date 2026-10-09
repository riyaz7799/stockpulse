import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../api/stockService';
import { useUiStore } from '../stores/uiStore';
import { details, renderWithClient } from '../test/utils';
import StockDetails from './StockDetails';

vi.mock('../api/stockService');
vi.mock('./PriceChart', () => ({ default: ({ symbol }: { symbol: string }) => <div>chart for {symbol}</div> }));

describe('StockDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useUiStore.setState({ selectedStockSymbol: null });
  });

  it('prompts to select a stock', () => {
    renderWithClient(<StockDetails />);
    expect(screen.getByText(/select a stock/i)).toBeInTheDocument();
    expect(api.fetchStockDetails).not.toHaveBeenCalled();
  });

  it('shows loading, then quote and chart', async () => {
    vi.mocked(api.fetchStockDetails).mockResolvedValue(details);
    vi.mocked(api.fetchHistoricalData).mockResolvedValue([{ date: '2026-01-01', close: 1 }]);
    useUiStore.setState({ selectedStockSymbol: 'AAPL' });
    renderWithClient(<StockDetails />);
    expect(screen.getByText(/loading quote/i)).toBeInTheDocument();
    expect(await screen.findByText('$230.50')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Apple Inc\. \(AAPL\)/ })).toBeInTheDocument();
    expect(await screen.findByText('chart for AAPL')).toBeInTheDocument();
  });

  it('shows errors with a retry button', async () => {
    vi.mocked(api.fetchStockDetails).mockRejectedValueOnce(new Error('boom')).mockResolvedValue(details);
    vi.mocked(api.fetchHistoricalData).mockRejectedValue(new Error('no history'));
    useUiStore.setState({ selectedStockSymbol: 'AAPL' });
    renderWithClient(<StockDetails />);
    expect(await screen.findByText('boom')).toBeInTheDocument();
    expect(await screen.findByText('no history')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: /try again/i })[0]);
    await waitFor(() => expect(screen.getByText('$230.50')).toBeInTheDocument());
  });
});
