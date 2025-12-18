import { useState } from "react";
import { useCurrencyStore } from "../features/settings/currency/model/currency.store";
import { allTransactions } from "../features/transactions/data/allTransactions";
import { getCategoryIcon, getCategoryColor } from "../features/transactions/data/categoryConfig";

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const currency = useCurrencyStore(state => state.selectedCurrency);

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
            <p className="text-xl text-green-900">+{totalIncome.toLocaleString("ru-RU")} {currency}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-sm text-red-700 mb-1">Расходы</p>
            <p className="text-xl text-red-900">-{totalExpense.toLocaleString("ru-RU")} {currency}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-muted/30 text-primary"
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter("income")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "income"
                ? "bg-primary text-white"
                : "bg-muted/30 text-primary"
            }`}
          >
            Доходы
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "expense"
                ? "bg-primary text-white"
                : "bg-muted/30 text-primary"
            }`}
          >
            Расходы
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => {
          const Icon = getCategoryIcon(transaction.category);
          const color = getCategoryColor(transaction.category);
          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color: color }} />
              </div>
              <div className="flex-1 min-w-0 text-primary">
                <p className="truncate">{transaction.description}</p>
                <p className="text-sm ">{transaction.category}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toLocaleString("ru-RU")} {currency}
                </p>
                <p className="text-sm text-primary">{transaction.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Transactions;