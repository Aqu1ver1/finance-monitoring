import { ShoppingCart, Car, Home as HomeIcon, Coffee, Sparkles, Utensils } from "lucide-react";
import TotalBudgetSummary from "../features/budget/ui/TotalBudgetSummary/TotalBudgetSummary";
import { useTransactionsStore } from "../features/transactions/model/transactions.store";
import { useState } from "react";
import { useBudgetStore } from "../features/budget/model/budget.store";
import BudgerCategories from "../features/budget/ui/BudgetCategories";


const Budget = () => {
  const transactions = useTransactionsStore(state => state.transactions);
  const { budget, dateRange } = useBudgetStore();

  const [isNull, setIsNull] = useState(budget <= 0);
  const totalExpenses = transactions.reduce((sum, item) => item.amount < 0 ? sum + Math.abs(item.amount) : sum, 0);
  const totalPercentage = (totalExpenses / budget) * 100;

  return (
    <div className="p-6 pb-8">
      {/* Header */}
        <TotalBudgetSummary
          totalSpent={totalExpenses}
          totalLimit={budget}
          totalPercentage={totalPercentage}
          isNull={isNull}
          date={dateRange ? `${dateRange.startDate} - ${dateRange.endDate}` : ''}
        />
        <BudgerCategories/>
    </div>
  );
}
export default Budget;
