import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';

interface UiState {
  selectedStockSymbol: string | null;
  theme: Theme;
  setSelectedStockSymbol: (symbol: string | null) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const prefersDark = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedStockSymbol: null,
      theme: prefersDark() ? 'dark' : 'light',
      setSelectedStockSymbol: (symbol) => set({ selectedStockSymbol: symbol }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'stockpulse-ui',
      // Only persist user preferences, not the transient selection.
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
