import { useMemo } from 'react';
import type { Transaction } from '../../entities/transactions/transactions.store';
import type { Category } from '../../shared/config/defaultCategories';

export type ExpenseItem = {
  id_category: number;
  amount: number;
  color: string;
  category: string;
};

type UseExpenseDataParams = {
  transactions: Transaction[];
  allCategories: Category[];
  getColorForCategory: (categoryId: number, usedColors: string[]) => string;
  translateCategory: (categoryName: string) => string;
  noExpensesLabel: string;
};

export const useExpenseData = ({
  transactions,
  allCategories,
  getColorForCategory,
  translateCategory,
  noExpensesLabel,
}: UseExpenseDataParams): ExpenseItem[] => {
  return useMemo(() => {
    const map = new Map<number, ExpenseItem>();
    const usedColors: string[] = [];

    // Aggregate expenses by category
    for (const transaction of transactions) {
      if (transaction.type !== -1) continue; // Only expenses

      const prev = map.get(transaction.id_category);

      if (prev) {
        prev.amount += Math.abs(transaction.amount);
      } else {
        const category = allCategories.find(
          (cat) => cat.id === transaction.id_category && cat.type === 'expense'
        );

        const label = category ? translateCategory(category.category) : noExpensesLabel;
        const color = getColorForCategory(transaction.id_category, usedColors);

        map.set(transaction.id_category, {
          id_category: transaction.id_category,
          amount: Math.abs(transaction.amount),
          color,
          category: label,
        });
        
        usedColors.push(color);
      }
    }

    const aggregated = Array.from(map.values());

    // Return placeholder if no expenses
    if (aggregated.length === 0) {
      return [
        {
          id_category: -1,
          category: noExpensesLabel,
          amount: 1,
          color: '#E0E0E0',
        },
      ];
    }

    return aggregated;
  }, [transactions, allCategories, getColorForCategory, translateCategory, noExpensesLabel]);
};
