import { useState, useMemo } from "react";
import { useCurrencyStore } from "../features/currency/currency.store";
import { useTransactionsStore } from "../entities/transactions/transactions.store";
import TransactionCard from "../entities/transactions/ui/TransactionCard";
import StatCard from "../widgets/StatCard/ui/StatCard";
import { TrendingUp } from "lucide-react";

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const transactions = useTransactionsStore(state => state.transactions);

  // Обернем расчеты в useMemo, чтобы не пересчитывать их при каждом рендере
  const { filteredTransactions, totalIncome, totalExpense } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type > 0)
      .reduce((sum, t) => sum + t.amount*t.type, 0);
      
    const expense = transactions
      .filter((t) => t.type < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount*t.type), 0);
    const filtered = transactions.filter((t) => {
      if (filter === "income") return t.type > 0;
      if (filter === "expense") return t.type < 0;
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
          <StatCard label="Доходы" amount={totalIncome} currency={currency} type="income" icon={TrendingUp} />
          <StatCard label="Расходы" amount={totalExpense} currency={currency} type="expense" icon={TrendingUp} />
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
            <TransactionCard key={transaction.id} transaction={transaction} />
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