import { useMemo } from 'react'
import type { LucideIcon } from 'lucide-react';
import CircularProgress from "../../transactions/ui/CircularProgress";
import { useCurrencyStore } from '../../../features/settings/currency/model/currency.store';
import { useTransactionsStore } from '../../transactions/model/transactions.store';
import { getIdByCategory, getCategoryColor, getCategoryIcon } from '../../transactions/data/categoryConfig';
import { useBudgetStore } from '../model/budget.store';

type ExpenseItem = {
  category: string;
  amount: number;
  color: string;
  icon: LucideIcon;
};

const BudgetCategories = () => {
  const { budget } = useBudgetStore();
  const transactions = useTransactionsStore(state => state.transactions);
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const dateRange = useBudgetStore(state => state.dateRange);

  const expenseData: ExpenseItem[] = useMemo(() => {
    const map = new Map<string, ExpenseItem>();
    for (const item of transactions) {
      if (item.type !== 'expense') continue;
      if (dateRange) {
        const itemDate = new Date(item.date);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);

        if (itemDate < start || itemDate > end) continue; // пропускаем, если не в периоде
      }
      const categoryLabel = getIdByCategory(item.category)?.category || item.category;
      const color = getCategoryColor(item.category);
      const icon = getCategoryIcon(item.category);
      const prev = map.get(categoryLabel);

      if (prev) {
        prev.amount += Math.abs(item.amount);
      } else {
        map.set(categoryLabel, {
          category: categoryLabel,
          amount: Math.abs(item.amount),
          color,
          icon,
        });
      }
    }

    const aggregated = Array.from(map.values());
    if (aggregated.length === 0 || budget === 0) {
      return [{ category: 'Нет расходов', amount: 0, color: '#E0E0E0', icon: getCategoryIcon('other') }];
    }

    return aggregated;
  }, [transactions, budget, dateRange]);
  return (
    <>
      {expenseData.map((category) => {
        const percentage = (category.amount / budget == 0 ? 1 : budget) * 100;
        const isOverBudget = percentage > 100;

        return (
          <div
            key={category.category}
            className="bg-muted/30 rounded-2xl p-5"
          >
            <div className="flex items-start gap-4">
              <CircularProgress
                percentage={Math.min(percentage, 100)}
                color={isOverBudget ? "#EF4444" : category.color}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <category.icon className="w-4 h-4" style={{ color: category.color }} />
                    </div>
                    <p>{category.category}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Потрачено</span>
                    <span className={isOverBudget ? "text-red-600" : ""}>
                      {category.amount.toLocaleString("ru-RU")} {currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Лимит</span>
                    <span>{budget.toLocaleString("ru-RU")} {currency}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Осталось</span>
                    <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                      {(budget - category.amount).toLocaleString("ru-RU")} {currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  )
}

export default BudgetCategories