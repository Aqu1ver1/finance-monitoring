import { useState } from "react";
import { ShoppingCart, Home as HomeIcon, Car, Coffee, Sparkles, TrendingUp, ChevronDown } from "lucide-react";

interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: any;
  color: string;
}

const allTransactions: Transaction[] = [
  {
    id: 1,
    name: "Зарплата",
    category: "Доход",
    amount: 75000,
    date: "15 дек",
    icon: TrendingUp,
    color: "#10B981",
  },
  {
    id: 2,
    name: "Аренда квартиры",
    category: "Жильё",
    amount: -25000,
    date: "14 дек",
    icon: HomeIcon,
    color: "#F59E0B",
  },
  {
    id: 3,
    name: "Продукты",
    category: "Еда",
    amount: -1250,
    date: "14 дек",
    icon: ShoppingCart,
    color: "#3B82F6",
  },
  {
    id: 4,
    name: "Кафе",
    category: "Еда",
    amount: -890,
    date: "13 дек",
    icon: Coffee,
    color: "#3B82F6",
  },
  {
    id: 5,
    name: "Такси",
    category: "Транспорт",
    amount: -350,
    date: "13 дек",
    icon: Car,
    color: "#10B981",
  },
  {
    id: 6,
    name: "Кино",
    category: "Развлечения",
    amount: -800,
    date: "12 дек",
    icon: Sparkles,
    color: "#8B5CF6",
  },
  {
    id: 7,
    name: "Продукты",
    category: "Еда",
    amount: -2100,
    date: "12 дек",
    icon: ShoppingCart,
    color: "#3B82F6",
  },
  {
    id: 8,
    name: "Метро",
    category: "Транспорт",
    amount: -120,
    date: "11 дек",
    icon: Car,
    color: "#10B981",
  },
  {
    id: 9,
    name: "Ресторан",
    category: "Еда",
    amount: -1750,
    date: "10 дек",
    icon: Coffee,
    color: "#3B82F6",
  },
  {
    id: 10,
    name: "Подработка",
    category: "Доход",
    amount: 5000,
    date: "9 дек",
    icon: TrendingUp,
    color: "#10B981",
  },
];

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filteredTransactions = allTransactions.filter((t) => {
    if (filter === "income") return t.amount > 0;
    if (filter === "expense") return t.amount < 0;
    return true;
  });

  const totalIncome = allTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = allTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="p-6 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="mb-4">История операций</h2>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-700 mb-1">Доходы</p>
            <p className="text-xl text-green-900">+{totalIncome.toLocaleString("ru-RU")} ₽</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-sm text-red-700 mb-1">Расходы</p>
            <p className="text-xl text-red-900">-{totalExpense.toLocaleString("ru-RU")} ₽</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter("income")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "income"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground"
            }`}
          >
            Доходы
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "expense"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground"
            }`}
          >
            Расходы
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => {
          const Icon = transaction.icon;
          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${transaction.color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color: transaction.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={transaction.amount > 0 ? "text-green-600" : "text-foreground"}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toLocaleString("ru-RU")} ₽
                </p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Transactions;