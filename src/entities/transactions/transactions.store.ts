import { create } from 'zustand';
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

interface TransactionsStore {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: number) => void;
  getTransactions: () => Transaction[];
  removeAllTransactions: () => void;
}

export const useTransactionsStore = create<TransactionsStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      
      addTransaction: (transaction: Omit<Transaction, 'id'>) => {
        set((state) => {
          const newTransaction: Transaction = {
            ...transaction,
            id: state.transactions.length > 0 
              ? Math.max(...state.transactions.map(t => t.id)) + 1 
              : 1,
          };
          return {
            transactions: [newTransaction, ...state.transactions],
          };
        });
      },
      
      removeTransaction: (id: number) => {
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id),
        }));
      },
      removeAllTransactions: () => {
        set(() => ({
          transactions: [],
        }));
      },
      
      getTransactions: () => get().transactions,

    }),
    {
      name: 'transactions-storage',
      version: 1,
    }
  )
);
