import { create } from 'zustand';

interface CurrencyState {
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  selectedCurrency: '€',
  setCurrency: (currency) => set({ selectedCurrency: currency }),
}));
