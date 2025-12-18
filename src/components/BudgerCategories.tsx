import React from 'react'
import CircularProgress from './CircularProgress';
import { useCurrencyStore } from '../features/settings/currency/model/currency.store';

interface BudgetCategory {
  id: number;
  name: string;
  spent: number;
  limit: number;
  icon: any;
  color: string;
}

const BudgerCategories = ({ budgetCategories }: { budgetCategories: BudgetCategory[] }) => {
  const currency = useCurrencyStore(state => state.selectedCurrency);
  return (
    <div>
        <h3 className="mb-4">Категории</h3>
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const Icon = category.icon;
            const percentage = (category.spent / category.limit) * 100;
            const isOverBudget = percentage > 100;

            return (
              <div
                key={category.id}
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
                          <Icon className="w-4 h-4" style={{ color: category.color }} />
                        </div>
                        <p>{category.name}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Потрачено</span>
                        <span className={isOverBudget ? "text-red-600" : ""}>
                          {category.spent.toLocaleString("ru-RU")} {currency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Лимит</span>
                        <span>{category.limit.toLocaleString("ru-RU")} {currency}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Осталось</span>
                        <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                          {(category.limit - category.spent).toLocaleString("ru-RU")} {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
  )
}

export default BudgerCategories