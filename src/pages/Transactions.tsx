import { useMemo, useState } from "react";
import { useCurrencyStore } from "../features/currency/currency.store";
import { useTransactionsStore } from "../entities/transactions/transactions.store";
import TransactionCard from "../entities/transactions/ui/TransactionCard";
import StatCard from "../widgets/StatCard/ui/StatCard";
import { TrendingUp } from "lucide-react";
import { useTranslate } from "../features/swapLanguages/useTranslate";
import { useCustomCategoriesStore } from "../features/customCategories/customCategories.store";
import { defaultCategories } from "../shared/config/defaultCategories";
import { Button } from "../shared/ui/Button";
import { getGptAdvice, type AdviceFocus } from "../shared/lib/gptAdvice";
import { useLanguageStore } from "../features/swapLanguages/language.store";

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [adviceFocus, setAdviceFocus] = useState<AdviceFocus>("overview");
  const [adviceGoal, setAdviceGoal] = useState("");
  const [adviceText, setAdviceText] = useState("");
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const transactions = useTransactionsStore(state => state.transactions);
  const customCategories = useCustomCategoriesStore(state => state.categories);
  const lang = useLanguageStore(state => state.lang);
  const t = useTranslate();
  const allCategories = useMemo(
    () => [...defaultCategories, ...customCategories],
    [customCategories]
  );
  const adviceOptions = useMemo(
    () => [
      { value: "overview" as const, label: t("transactions.gpt.typeOverview") },
      { value: "savings" as const, label: t("transactions.gpt.typeSavings") },
      { value: "cuts" as const, label: t("transactions.gpt.typeCuts") },
      { value: "budget" as const, label: t("transactions.gpt.typeBudget") }
    ],
    [t]
  );

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

  const transactionsForAdvice = useMemo(() => {
    const getCategoryLabel = (categoryId: number) => {
      const category = allCategories.find((cat) => cat.id === categoryId);
      if (!category) return t("transactionCard.noCategory");
      const key = `categories.${category.category}`;
      const translated = t(key);
      return translated === key ? category.category : translated;
    };

    return transactions
      .map((transaction) => {
        const date = new Date(transaction.date);
        return {
          date: Number.isNaN(date.getTime())
            ? ""
            : date.toISOString().slice(0, 10),
          type: transaction.type > 0 ? "income" : "expense",
          amount: Math.abs(transaction.amount * transaction.type),
          currency,
          category: getCategoryLabel(transaction.id_category),
          description: transaction.description ?? ""
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 80);
  }, [transactions, allCategories, t, currency]);

  const handleGetAdvice = async () => {
    setAdviceError(null);
    setAdviceText("");

    if (!adviceGoal.trim()) {
      setAdviceError(t("transactions.gpt.emptyError"));
      return;
    }

    if (transactions.length === 0) {
      setAdviceError(t("transactions.gpt.noTransactions"));
      return;
    }

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setAdviceError(t("transactions.gpt.apiMissing"));
      return;
    }

    setIsAdviceLoading(true);
    try {
      const response = await getGptAdvice({
        focus: adviceFocus,
        goal: adviceGoal.trim(),
        currency,
        language: lang,
        totals: {
          income: totalIncome,
          expense: totalExpense,
          net: totalIncome - totalExpense
        },
        transactions: transactionsForAdvice
      });
      setAdviceText(response);
    } catch {
      setAdviceError(t("transactions.gpt.error"));
    } finally {
      setIsAdviceLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary p-6 pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6">{t("titles.transactionsPage")}</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard label={t("common.income")} amount={totalIncome} currency={currency} type="income" icon={TrendingUp} />
          <StatCard label={t("common.expenses")} amount={totalExpense} currency={currency} type="expense" icon={TrendingUp} />
        </div>

        <div className="mb-8 rounded-2xl border border-muted bg-secondary/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">{t("transactions.gpt.title")}</h3>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr,auto]">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">
                {t("transactions.gpt.typeLabel")}
              </label>
              <select
                className="rounded-lg border border-muted bg-background px-3 py-2 text-sm text-primary"
                value={adviceFocus}
                onChange={(event) => setAdviceFocus(event.target.value as AdviceFocus)}
              >
                {adviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-muted-foreground">
                {t("transactions.gpt.goalLabel")}
              </label>
              <textarea
                rows={2}
                value={adviceGoal}
                onChange={(event) => setAdviceGoal(event.target.value)}
                placeholder={t("transactions.gpt.goalPlaceholder")}
                className="min-h-[44px] rounded-lg border border-muted bg-background px-3 py-2 text-sm text-primary"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGetAdvice}
                loading={isAdviceLoading}
              >
                {isAdviceLoading
                  ? t("transactions.gpt.loading")
                  : t("transactions.gpt.cta")}
              </Button>
            </div>
          </div>

          {adviceError && (
            <p className="mt-3 text-sm text-red-600">{adviceError}</p>
          )}

          {adviceText && (
            <div className="mt-4 rounded-xl border border-muted bg-background/70 p-4">
              <p className="text-sm font-semibold mb-2">
                {t("transactions.gpt.resultTitle")}
              </p>
              <div className="whitespace-pre-line text-sm text-primary">
                {adviceText}
              </div>
            </div>
          )}
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
              {type === "all" ? t("transactions.filters.all") : type === "income" ? t("transactions.filters.income") : t("transactions.filters.expense")}
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
            {t("transactions.empty")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;