import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PriceChart from './PriceChart';

vi.mock('recharts', () => {
  const Pass = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Pass, AreaChart: Pass, Area: () => null, XAxis: () => null,
    YAxis: () => null, CartesianGrid: () => null, Tooltip: () => null,
  };
});

describe('PriceChart', () => {
  it('exposes an accessible summary', () => {
    render(<PriceChart symbol="AAPL" data={[{ date: '2026-01-01', close: 100 }, { date: '2026-01-02', close: 110 }]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/AAPL closing price over 2 days.*\$100\.00.*\$110\.00/);
  });

  it('shows an empty state without data', () => {
    render(<PriceChart symbol="AAPL" data={[]} />);
    expect(screen.getByText(/no historical data/i)).toBeInTheDocument();
  });
});
