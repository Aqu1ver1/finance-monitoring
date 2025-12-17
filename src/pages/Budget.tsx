import { ShoppingCart, Car, Home as HomeIcon, Coffee, Sparkles, Utensils } from "lucide-react";
import CircularProgress from "../components/CircularProgress";

interface BudgetCategory {
  id: number;
  name: string;
  spent: number;
  limit: number;
  icon: any;
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
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalLimit = budgetCategories.reduce((sum, cat) => sum + cat.limit, 0);
  const totalPercentage = (totalSpent / totalLimit) * 100;

  return (
    <div className="p-6 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-6">Бюджет на месяц</h2>
        
        {/* Total Budget Summary */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 mb-6">
          <p className="text-blue-100 mb-2">Общий бюджет</p>
          <p className="text-3xl mb-4">{totalLimit.toLocaleString("ru-RU")} ₽</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Потрачено</p>
              <p className="text-xl">{totalSpent.toLocaleString("ru-RU")} ₽</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Осталось</p>
              <p className="text-xl">{(totalLimit - totalSpent).toLocaleString("ru-RU")} ₽</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-blue-400/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
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
                          {category.spent.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Лимит</span>
                        <span>{category.limit.toLocaleString("ru-RU")} ₽</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Осталось</span>
                        <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                          {(category.limit - category.spent).toLocaleString("ru-RU")} ₽
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
    </div>
  );
}
export default Budget;
