import React,{ useMemo } from 'react'
import CircularProgress from "./CircularProgress";
import { useCurrencyStore } from '../../currency/currency.store';
import { useTransactionsStore } from '../../transactions/transactions.store';
import { useBudgetStore } from '../budget.store';
import { categories } from '../../categories/defaultCategories';

type ExpenseItem = {
  id_category: number;
  amount: number;
  color: string;
  iconUrl?: string;
};

const BudgetCategories = () => {
  const { budget } = useBudgetStore();
  const transactions = useTransactionsStore(state => state.transactions);
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const dateRange = useBudgetStore(state => state.dateRange);

  const expenseData: ExpenseItem[] = useMemo(() => {
    const map = new Map<number, ExpenseItem>();
    for (const item of transactions) {
      if (item.type !== 'expense') continue;
      if (dateRange) {
        const itemDate = new Date(item.date);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);

        if (itemDate < start || itemDate > end) continue; // пропускаем, если не в периоде
      }
      const category = transactions.find(cat => cat.id_category === item.id_category)
          ? categories.find(cat => cat.id === item.id_category && cat.type === 'expense')
          : null;
      const color = category?.color || '#CCCCCC';
      const prev = map.get(category?.id || 0);

      if (prev) {
        prev.amount += Math.abs(item.amount);
      } else {
        map.set(category?.id || 0, {
          id_category: category?.id || 0,
          amount: Math.abs(item.amount),
          color,
          iconUrl: category?.iconUrl,
        });
      }
    }

    const aggregated = Array.from(map.values());
    if (aggregated.length === 0 || budget === 0) {
      return [{ id_category: 0, amount: 0, color: '#E0E0E0', iconUrl: undefined }];
    }

    return aggregated;
  }, [transactions, budget, dateRange]);
  return (
    <>
      {expenseData.map((category) => {
        let budgetSave = budget;
        if (budget === 0) {
          budgetSave = 1;
        }
        const percentage = (category.amount / budgetSave) * 100;
        const isOverBudget = percentage > 100;

        return (
          <div
            key={category.id_category}
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
                      {category.iconUrl && (
                        <img src={category.iconUrl} alt="icon" className="w-4 h-4" style={{ color: category.color }} />
                      )}
                    </div>
                    <p>{category.id_category}</p>
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