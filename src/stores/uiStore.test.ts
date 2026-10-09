import { beforeEach, describe, expect, it } from 'vitest';
import { useUiStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => useUiStore.setState({ selectedStockSymbol: null, theme: 'light' }));

  it('starts with no selected stock', () => {
    expect(useUiStore.getState().selectedStockSymbol).toBeNull();
  });

  it('sets and clears the selected stock', () => {
    useUiStore.getState().setSelectedStockSymbol('AAPL');
    expect(useUiStore.getState().selectedStockSymbol).toBe('AAPL');
    useUiStore.getState().setSelectedStockSymbol(null);
    expect(useUiStore.getState().selectedStockSymbol).toBeNull();
  });

  it('toggles and sets the theme', () => {
    useUiStore.getState().toggleTheme();
    expect(useUiStore.getState().theme).toBe('dark');
    useUiStore.getState().toggleTheme();
    expect(useUiStore.getState().theme).toBe('light');
    useUiStore.getState().setTheme('dark');
    expect(useUiStore.getState().theme).toBe('dark');
  });
});
