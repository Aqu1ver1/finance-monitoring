import { useMemo, useState } from "react";
import { useCurrencyStore } from "../features/currency/currency.store";
import { useTransactionsStore } from "../entities/transactions/transactions.store";
import TransactionCard from "../entities/transactions/ui/TransactionCard";
import StatCard from "../widgets/StatCard/ui/StatCard";
import { TrendingUp } from "lucide-react";
import { useTranslate } from "../features/swapLanguages/useTranslate";
import AdviseSection from "../features/gptAdvicer/ui/AdviseSection";
import { useLanguageStore } from "../features/swapLanguages/language.store";
import { useCustomCategoriesStore } from "../features/customCategories/customCategories.store";
import { defaultCategories } from "../shared/config/defaultCategories";
import { usePersistentColors } from "../features/expenseChart/usePersistentColors";

const formatMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
};

const formatMonthLabel = (monthKey: string, locale: string): string => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString(locale, { month: "long", year: "numeric" });
};

const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const transactions = useTransactionsStore(state => state.transactions);
  const monthlySummaries = useTransactionsStore(state => state.monthlySummaries ?? []);
  const customCategories = useCustomCategoriesStore(state => state.categories);
  const lang = useLanguageStore(state => state.lang);
  const t = useTranslate();
  const allCategories = useMemo(
    () => [...defaultCategories, ...customCategories],
    [customCategories]
  );
  const { getColorForCategory } = usePersistentColors();
  const currentMonthKey = useMemo(() => formatMonthKey(new Date()), []);
  const [selectedMonthKey, setSelectedMonthKey] = useState(currentMonthKey);
  const isCurrentMonth = selectedMonthKey === currentMonthKey;

  const monthOptions = useMemo(() => {
    const keys = new Set([currentMonthKey, ...monthlySummaries.map((summary) => summary.monthKey)]);
    const locale = lang === "ru" ? "ru-RU" : "en-US";
    return Array.from(keys)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => ({
        value: key,
        label: formatMonthLabel(key, locale)
      }));
  }, [currentMonthKey, monthlySummaries, lang]);


  // Обернем расчеты в useMemo, чтобы не пересчитывать их при каждом рендере
  const { filteredTransactions, currentIncome, currentExpense } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type > 0)
      .reduce((sum, t) => sum + t.amount * t.type, 0);

    const expense = transactions
      .filter((t) => t.type < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount * t.type), 0);
    const filtered = transactions.filter((t) => {
      if (filter === "income") return t.type > 0;
      if (filter === "expense") return t.type < 0;
      return true;
    });

    return {
      filteredTransactions: filtered,
      currentIncome: income,
      currentExpense: expense
    };
  }, [transactions, filter]);

  const archivedSummary = useMemo(
    () => monthlySummaries.find((summary) => summary.monthKey === selectedMonthKey) ?? null,
    [monthlySummaries, selectedMonthKey]
  );

  const totalIncome = isCurrentMonth ? currentIncome : archivedSummary?.income ?? 0;
  const totalExpense = isCurrentMonth ? currentExpense : archivedSummary?.expense ?? 0;
  const visibleTransactions = isCurrentMonth ? filteredTransactions : [];
  const archivedExpenseByCategory = useMemo(() => {
    if (isCurrentMonth || !archivedSummary) return [];
    const usedColors: string[] = [];
    const data = (archivedSummary.expenseByCategory ?? [])
      .map((entry) => {
        const category = allCategories.find((cat) => cat.id === entry.id_category);
        const key = category ? `categories.${category.category}` : "transactionCard.noCategory";
        const translated = t(key);
        const label = translated === key && category ? category.category : translated;
        const color = getColorForCategory(entry.id_category, usedColors);
        usedColors.push(color);

        return {
          id_category: entry.id_category,
          amount: entry.amount,
          label,
          color
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return data;
  }, [isCurrentMonth, archivedSummary, allCategories, getColorForCategory, t]);

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
        {/* GPT Advice Section */}
        <AdviseSection totalExpense={totalExpense} totalIncome={totalIncome} />
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit border border-muted">
            {(["all", "income", "expense"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === type
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-primary"
                  }`}
              >
                {type === "all" ? t("transactions.filters.all") : type === "income" ? t("transactions.filters.income") : t("transactions.filters.expense")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">
              {t("transactions.monthLabel")}
            </label>
            <select
              className="rounded-lg border border-muted bg-background px-3 py-2 text-sm text-primary"
              value={selectedMonthKey}
              onChange={(event) => setSelectedMonthKey(event.target.value)}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!isCurrentMonth && (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("transactions.archivedNotice")}
          </p>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {!isCurrentMonth && (
          <div className="bg-muted/30 rounded-2xl p-6 border border-muted">
            <h3 className="mb-4 font-semibold">
              {t("transactions.categorySummaryTitle")}
            </h3>
            {archivedExpenseByCategory.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {archivedExpenseByCategory.map((item) => (
                  <div key={item.id_category} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.amount.toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} {currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("transactions.categorySummaryEmpty")}
              </p>
            )}
          </div>
        )}
        {visibleTransactions.length > 0 ? (
          visibleTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {isCurrentMonth ? t("transactions.empty") : t("transactions.archivedEmpty")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;