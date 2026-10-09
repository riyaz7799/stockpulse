import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { useUiStore } from '../stores/uiStore';
import { stocks } from '../test/utils';
import StockList from './StockList';

describe('StockList', () => {
  beforeEach(() => useUiStore.setState({ selectedStockSymbol: null }));

  it('renders symbol and price for each stock', () => {
    render(<StockList stocks={stocks} />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('$230.50')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('updates the Zustand store when a stock is clicked', async () => {
    render(<StockList stocks={stocks} />);
    await userEvent.click(screen.getByRole('button', { name: /TSLA/ }));
    expect(useUiStore.getState().selectedStockSymbol).toBe('TSLA');
    expect(screen.getByRole('button', { name: /TSLA/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('is keyboard accessible', async () => {
    render(<StockList stocks={stocks} />);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(useUiStore.getState().selectedStockSymbol).toBe('AAPL');
  });

  it('shows an empty state', () => {
    render(<StockList stocks={[]} />);
    expect(screen.getByRole('status')).toHaveTextContent(/no stocks match/i);
  });
});
