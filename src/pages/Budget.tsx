import { ShoppingCart, Car, Home as HomeIcon, Coffee, Sparkles, Utensils } from "lucide-react";
import TotalBudgetSummary from "../features/transactions/ui/TotalBudgetSummary";
import BudgerCategories from "../components/BudgerCategory";
import { useTransactionsStore } from "../features/transactions/model/transactions.store";
import { useState } from "react";

interface BudgetCategory {
  id: number;
  name: string;
  spent: number;
  limit: number;
  icon: React.ComponentType<any>;
  color: string;
}

const budgetCategories: BudgetCategory[] = [
  { id: 1, name: "Еда", spent: 15000, limit: 20000, icon: ShoppingCart, color: "#3B82F6" },
  { id: 2, name: "Транспорт", spent: 8000, limit: 10000, icon: Car, color: "#10B981" },
  { id: 3, name: "Жильё", spent: 25000, limit: 25000, icon: HomeIcon, color: "#F59E0B" },
  { id: 4, name: "Развлечения", spent: 7000, limit: 12000, icon: Coffee, color: "#8B5CF6" },
  { id: 5, name: "Прочее", spent: 5000, limit: 8000, icon: Sparkles, color: "#EC4899" },
];


const Budget = () => {
  const totalLimit = 1;
  const [isNull, setIsNull] = useState(totalLimit < 0);
  const transactions = useTransactionsStore(state => state.transactions);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);

  const totalPercentage = (totalSpent / totalLimit) * 100;

  return (
    <div className="p-6 pb-8">
      {/* Header */}
        <TotalBudgetSummary
          totalSpent={totalSpent}
          totalLimit={totalLimit}
          totalPercentage={totalPercentage}
          isNull={isNull}
        />
    </div>
  );
}
export default Budget;
