import { create } from 'zustand';
import { persist } from 'zustand/middleware';



interface BudgetState {
  budget: number;
  scheme: string;
  create_date: Date;
  setBudgetData: (
    budget: number,
    scheme: string,
    create_date: Date
  ) => void;
  resetBudgetData: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      budget: 0,
      scheme: '',
      create_date: new Date(),
      setBudgetData: (budget, scheme, create_date) =>
        set({ budget, scheme, create_date }),
      resetBudgetData: () => set({ budget: 0, scheme: '', create_date: new Date() }),
    }),
    {
      name: 'budget-storage', // ключ в localStorage
      partialize: (state) => ({
        budget: state.budget,
        scheme: state.scheme,
        create_date: state.create_date,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<BudgetState>;
        return {
          ...currentState,
          ...persisted,
          create_date: persisted.create_date 
            ? new Date(persisted.create_date) 
            : new Date(),
        };
      },
    }
  )
);