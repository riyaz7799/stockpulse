import { describe, expect, it } from 'vitest';
import { formatChange, formatPrice, formatVolume, trendOf } from './format';
import { validateSearch } from './validation';

describe('validateSearch', () => {
  it('accepts valid input', () => {
    expect(validateSearch('')).toBeNull();
    expect(validateSearch('AAPL')).toBeNull();
    expect(validateSearch('Apple Inc.')).toBeNull();
  });
  it('rejects invalid characters', () => {
    expect(validateSearch('<script>')).toMatch(/only letters/i);
  });
  it('rejects overly long input', () => {
    expect(validateSearch('a'.repeat(31))).toMatch(/30 characters/);
  });
});

describe('format helpers', () => {
  it('formats price', () => expect(formatPrice(1234.5)).toBe('$1,234.50'));
  it('formats change with sign', () => {
    expect(formatChange(2.5, 1.1)).toBe('+2.50 (+1.10%)');
    expect(formatChange(-3, -1.2)).toBe('−3.00 (−1.20%)');
    expect(formatChange(0, 0)).toBe('0.00 (0.00%)');
  });
  it('formats volume', () => expect(formatVolume(45_000_000)).toBe('45M'));
  it('derives trend', () => {
    expect(trendOf(1)).toBe('up');
    expect(trendOf(-1)).toBe('down');
    expect(trendOf(0)).toBe('flat');
  });
});
