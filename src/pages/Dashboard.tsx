import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrencyStore } from "../entities/currency/currency.store";
import { useTransactionsStore } from "../entities/transactions/transactions.store";
import TransactionCard from "../entities/transactions/ui/TransactionCard";
import ExpenseChart from "../entities/transactions/ui/ExpenseChart";
import StatCard from "../widgets/StatCard/ui/StatCard";
import  { calculateTotalIncome, calculateTotalExpenses, calculateBalance } from "../entities/transactions/calculations";

const Dashboard: React.FC = () => {
    const transactions = useTransactionsStore((state) => state.transactions);
    const currency = useCurrencyStore(state => state.selectedCurrency);

    const totalExpenses = calculateTotalExpenses(transactions);
    const totalIncome = calculateTotalIncome(transactions);
    const balance = calculateBalance(transactions);

    return (
        // Используем bg-background и text-primary для автоматической смены цветов
        <div className="bg-background text-primary p-6 transition-colors duration-300 ">
            <div className="mb-8">
                <p className="text-muted-foreground mb-1">Общий баланс</p>
                <h1 className="text-5xl font-bold mb-6">
                    {balance.toLocaleString("ru-RU")} {currency}
                </h1>

                <div className="flex gap-4">
                    {/* Карточка Дохода */}
                    <StatCard
                        icon={TrendingUp}
                        label="Доход"
                        amount={totalIncome}
                        currency={currency}
                        type="income"
                    />
                    {/* Карточка Расхода */}
                    <StatCard
                        icon={TrendingDown}
                        label="Расход"
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