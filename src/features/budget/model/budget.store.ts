import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BudgetState {
  budget: number;
  category: string;
  dateRange: { startDate: string; endDate: string } | null;
  setBudgetData: (
    budget: number,
    category: string,
    dateRange?: { startDate: string; endDate: string }
  ) => void;
  resetBudgetData: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      budget: 0,
      category: '',
      dateRange: null,
      setBudgetData: (budget, category, dateRange) =>
        set({ budget, category, dateRange: dateRange || null }),
      resetBudgetData: () => set({ budget: 0, category: '', dateRange: null }),
    }),
    {
      name: 'budget-storage', // ключ в localStorage
    }
  )
);