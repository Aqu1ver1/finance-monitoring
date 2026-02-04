import TotalBudgetSummary from "../entities/budget/ui/TotalBudgetSummary";
import { useTransactionsStore } from "../entities/transactions/transactions.store";
import { useBudgetStore } from "../entities/budget/budget.store";
import BudgetCategories from "../entities/budget/ui/BudgetCategories";
import { formatDateToText } from "../shared/lib/dateFormatter";
import {getMonthEndDate, getMonthStartDate} from "../shared/lib/date";

const Budget = () => {
  const transactions = useTransactionsStore(state => state.transactions);
  const { budget, create_date, scheme } = useBudgetStore();
  const start = getMonthStartDate(create_date);
  const end = getMonthEndDate(create_date);
  const budgetDate = new Date(create_date);
  const dateRange = `${formatDateToText(start)} - ${formatDateToText(end)}`;
  const isNull = budget <= 0;

  const totalExpenses = transactions.reduce((sum, item) => {
    if (item.type !== -1) return sum;
    const txDate = new Date(item.date);
    const sameMonth = txDate.getMonth() === budgetDate.getMonth() && txDate.getFullYear() === budgetDate.getFullYear();
    if (!sameMonth) return sum;
    return sum + Math.abs(item.amount);
  }, 0);

  const totalPercentage = budget > 0 ? (totalExpenses / budget) * 100 : 0;

  return (
    <div className="min-h-screen bg-background text-primary p-6 pb-8 transition-colors duration-300">
      {/* Header */}
      {/*fix problem wth language*/}
        <TotalBudgetSummary
          totalSpent={totalExpenses}
          totalLimit={budget}
          totalPercentage={totalPercentage}
          isNull={isNull}
          date={dateRange}
        />
        <div className="px-4 gap-6 flex flex-col">
          <BudgetCategories scheme={scheme} />
        </div>
    </div>
  );
}
export default Budget;
