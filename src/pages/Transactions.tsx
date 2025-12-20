import { useState, useMemo } from "react";
import { useCurrencyStore } from "../features/settings/currency/model/currency.store";
import { useTransactionsStore } from "../features/transactions/model/transactions.store";
import CategoryTransactions from "../shared/ui/CategoryTransactions";

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const transactions = useTransactionsStore(state => state.transactions);

  // Обернем расчеты в useMemo, чтобы не пересчитывать их при каждом рендере
  const { filteredTransactions, totalIncome, totalExpense } = useMemo(() => {
    const income = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const filtered = transactions.filter((t) => {
      if (filter === "income") return t.amount > 0;
      if (filter === "expense") return t.amount < 0;
      return true;
    });

    return { 
      filteredTransactions: filtered, 
      totalIncome: income, 
      totalExpense: expense 
    };
  }, [transactions, filter]);

  return (
    <div className="min-h-screen bg-background text-primary p-6 pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6">История операций</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Доходы - используем secondary фон и зеленый акцент через прозрачность */}
          <div className="bg-secondary border border-muted rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Доходы</p>
            <p className="text-xl font-bold text-green-500">
              +{totalIncome.toLocaleString("ru-RU")} {currency}
            </p>
          </div>
          
          {/* Расходы - используем деструктивный цвет из темы */}
          <div className="bg-secondary border border-muted rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Расходы</p>
            <p className="text-xl font-bold text-destructive">
              -{totalExpense.toLocaleString("ru-RU")} {currency}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit border border-muted">
          {(["all", "income", "expense"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === type
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {type === "all" ? "Все" : type === "income" ? "Доходы" : "Расходы"}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <CategoryTransactions key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Операций пока нет
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;