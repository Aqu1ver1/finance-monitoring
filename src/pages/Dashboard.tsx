import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrencyStore } from "../features/currency/currency.store";
import { useTransactionsStore } from "../entities/transactions/transactions.store";
import TransactionCard from "../entities/transactions/ui/TransactionCard";
import ExpenseChart from "../features/expenseChart/ui/ExpenseChart";
import StatCard from "../widgets/StatCard/ui/StatCard";
import  { calculateTransactionSummary } from "../entities/transactions/calculations";
import { useTranslate } from "../features/swapLanguages/useTranslate";

const Dashboard: React.FC = () => {
    const transactions = useTransactionsStore((state) => state.transactions);
    const currency = useCurrencyStore(state => state.selectedCurrency);
    const t = useTranslate();

    const summary = calculateTransactionSummary(transactions);
    const totalIncome = summary.income;
    const totalExpenses = summary.expenses;
    const balance = summary.balance;

    return (
        // Используем bg-background и text-primary для автоматической смены цветов
        <div className="min-h-screen bg-background text-primary p-6 pb-24 transition-colors duration-300">
            <div className="mb-8">
                <p className="text-muted-foreground mb-1">{t("common.balance")}</p>
                <h1 className="text-5xl font-bold mb-6">
                    {balance.toLocaleString("ru-RU")} {currency}
                </h1>
                <div className="flex gap-4">
                    {/* Income Card */}
                    <StatCard
                        icon={TrendingUp}
                        label={t("common.income")}
                        amount={totalIncome}
                        currency={currency}
                        type="income"
                    />
                    {/* Expenses Card */}
                    <StatCard
                        icon={TrendingDown}
                        label={t("common.expenses")}
                        amount={totalExpenses}
                        currency={currency}
                        type="expense"
                    />
                </div>
            </div>

            <div className="grid gap-6">
                <div className="bg-secondary/50 p-4 rounded-3xl border border-muted">
                    <ExpenseChart />
                </div>
                <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => {
                        console.log('Rendering transaction:', transaction.id);
                        return (
                                <TransactionCard key={transaction.id} transaction={transaction} />
                            );
                    })}
                </div>
            </div>
        </div>
    );
}
export default Dashboard;