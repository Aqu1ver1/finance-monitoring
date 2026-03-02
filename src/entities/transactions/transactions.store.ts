import { create, type StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransactionType } from '../../shared/lib/transactionType';

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType["id"];
  id_category: number;
  description?: string;
  date: Date;
}

export type MonthlySummary = {
  monthKey: string;
  income: number;
  expense: number;
  net: number;
  count: number;
  expenseByCategory: { id_category: number; amount: number }[];
};

interface TransactionsStore {
  transactions: Transaction[];
  monthlySummaries: MonthlySummary[];
  lastArchiveAt: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setTransactions: (transactions: Transaction[]) => void;
  removeTransaction: (id: number) => void;
  removeAllTransactions: () => void;
  archivePastMonths: (today: Date) => void;
}

const formatMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
};

const formatArchiveKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set) => ({
      transactions: [],
      monthlySummaries: [],
      lastArchiveAt: null,
      
      addTransaction: (transaction: Omit<Transaction, 'id'>) => {
        set((state: TransactionsStore) => {
          const newTransaction: Transaction = {
            ...transaction,
            id: state.transactions.length > 0 
              ? Math.max(...state.transactions.map((t: Transaction) => t.id)) + 1 
              : 1,
          };
          return {
            transactions: [newTransaction, ...state.transactions],
          };
        });
      },

      setTransactions: (transactions: Transaction[]) => {
        set(() => ({
          transactions,
          monthlySummaries: [],
          lastArchiveAt: null,
        }));
      },
      
      removeTransaction: (id: number) => {
        set((state: TransactionsStore) => ({
          transactions: state.transactions.filter((t: Transaction) => t.id !== id),
        }));
      },
      removeAllTransactions: () => {
        set(() => ({
          transactions: [],
        }));
      },

      archivePastMonths: (today: Date) => {
        set((state: TransactionsStore) => {
          const archiveKey = formatArchiveKey(today);
          if (state.lastArchiveAt === archiveKey) return state;

          const currentMonthKey = formatMonthKey(today);
          const summaryMap = new Map<string, MonthlySummary>();
          const expenseByCategoryMap = new Map<string, Map<number, number>>();

          const remainingTransactions = state.transactions.filter((tx: Transaction) => {
            const txDate = new Date(tx.date);
            const txMonthKey = formatMonthKey(txDate);
            if (txMonthKey === currentMonthKey) return true;

            const prev = summaryMap.get(txMonthKey) ?? {
              monthKey: txMonthKey,
              income: 0,
              expense: 0,
              net: 0,
              count: 0,
              expenseByCategory: []
            };

            if (tx.type > 0) {
              prev.income += tx.amount * tx.type;
            } else if (tx.type < 0) {
              const expenseAmount = Math.abs(tx.amount * tx.type);
              prev.expense += expenseAmount;
              const categoryMap = expenseByCategoryMap.get(txMonthKey) ?? new Map<number, number>();
              categoryMap.set(tx.id_category, (categoryMap.get(tx.id_category) ?? 0) + expenseAmount);
              expenseByCategoryMap.set(txMonthKey, categoryMap);
            }
            prev.net = prev.income - prev.expense;
            prev.count += 1;

            summaryMap.set(txMonthKey, prev);
            return false;
          });

          summaryMap.forEach((summary, monthKey) => {
            const categoryMap = expenseByCategoryMap.get(monthKey);
            summary.expenseByCategory = categoryMap
              ? Array.from(categoryMap.entries()).map(([id_category, amount]) => ({ id_category, amount }))
              : [];
          });

          const summaryByKey = new Map(
            state.monthlySummaries.map((summary: MonthlySummary) => [summary.monthKey, summary])
          );

          summaryMap.forEach((summary, key) => {
            summaryByKey.set(key, summary);
          });

          const mergedSummaries = Array.from(summaryByKey.values());

          return {
            transactions: remainingTransactions,
            monthlySummaries: mergedSummaries,
            lastArchiveAt: archiveKey
          };
        });
      },

    }),
    {
      name: 'transactions-storage',
      version: 1,
    }
  ) as unknown as StateCreator<TransactionsStore>
);
