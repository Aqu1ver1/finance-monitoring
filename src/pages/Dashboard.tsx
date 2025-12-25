import { TrendingUp, TrendingDown } from "lucide-react";
import RecentTransactions from "../features/transactions/ui/RecentTransactions";
import { useCurrencyStore } from "../features/settings/currency/model/currency.store";
import { useTransactionsStore } from "../features/transactions/model/transactions.store";
import ExpenseChart from "../features/dashboard/ui/ExpenseChart";

const Dashboard: React.FC = () => {
    const transactions = useTransactionsStore((state) => state.transactions);
    const currency = useCurrencyStore(state => state.selectedCurrency);

    const totalExpenses = transactions.reduce((sum, item) => item.amount < 0 ? sum + Math.abs(item.amount) : sum, 0);
    const totalIncome = transactions.reduce((sum, item) => item.amount > 0 ? sum + item.amount : sum, 0);
    const balance = totalIncome - totalExpenses;

    return (
        // Используем bg-background и text-primary для автоматической смены цветов
        <div className="min-h-screen bg-background text-primary p-6 transition-colors duration-300">
            <div className="mb-8">
                <p className="text-muted-foreground mb-1">Общий баланс</p>
                <h1 className="text-5xl font-bold mb-6">
                    {balance.toLocaleString("ru-RU")} {currency}
                </h1>
                
                <div className="flex gap-4">
                    {/* Карточка Дохода */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-2xl border border-muted">
                        <div className="p-2 bg-green-500/10 rounded-full">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Доход</p>
                            <p className="font-semibold text-primary">
                                {totalIncome.toLocaleString("ru-RU")} {currency}
                            </p>
                        </div>
                    </div>

                    {/* Карточка Расхода */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-2xl border border-muted">
                        <div className="p-2 bg-destructive/10 rounded-full">
                            <TrendingDown className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Расход</p>
                            <p className="font-semibold text-primary">
                                {totalExpenses.toLocaleString("ru-RU")} {currency}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="bg-secondary/50 p-4 rounded-3xl border border-muted">
                    <ExpenseChart />
                </div>
                <RecentTransactions />
            </div>
        </div>
    );
}
export default Dashboard;