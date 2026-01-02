import TotalBudgetSummary from "../entites/budget/ui/TotalBudgetSummary";
import { useTransactionsStore } from "../entites/transactions/transactions.store";
import { useState } from "react";
import { useBudgetStore } from "../entites/budget/budget.store";
import BudgerCategories from "../entites/budget/ui/BudgetCategories";


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
