import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import StockSearch from './StockSearch';

describe('StockSearch', () => {
  it('propagates valid input', async () => {
    const onChange = vi.fn();
    render(<StockSearch onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/search stocks/i), 'aa');
    expect(onChange).toHaveBeenLastCalledWith('aa');
  });

  it('shows an error and blocks invalid input', async () => {
    const onChange = vi.fn();
    render(<StockSearch onChange={onChange} />);
    const input = screen.getByLabelText(/search stocks/i);
    await userEvent.type(input, '$');
    expect(screen.getByRole('alert')).toHaveTextContent(/only letters/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(onChange).not.toHaveBeenCalled();
  });
});
