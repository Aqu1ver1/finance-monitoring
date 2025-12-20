import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useCurrencyStore } from "../../features/settings/currency/model/currency.store";
import { useTransactionsStore } from '../../features/transactions/model/transactions.store';
import { getCategoryColor, getIdByCategory } from "../../features/transactions/data/categoryConfig";

type ExpenseItem = {
    category: string;
    amount: number;
    color: string;
};

const ExpenseChart = () => {
    const transactions = useTransactionsStore((state) => state.transactions);
    const currency = useCurrencyStore(state => state.selectedCurrency);

    const expenseData: ExpenseItem[] = useMemo(() => {
        const map = new Map<string, ExpenseItem>();

        for (const item of transactions) {
            if (item.type !== 'expense') continue;

            const categoryLabel = getIdByCategory(item.category)?.category || item.category;
            const color = getCategoryColor(item.category);
            const prev = map.get(categoryLabel);

            if (prev) {
                prev.amount += Math.abs(item.amount);
            } else {
                map.set(categoryLabel, {
                    category: categoryLabel,
                    amount: Math.abs(item.amount),
                    color,
                });
            }
        }

        const aggregated = Array.from(map.values());
        if (aggregated.length === 0) {
            return [{ category: 'Нет расходов', amount: 1, color: '#E0E0E0' }];
        }

        return aggregated;
    }, [transactions]);
    return (
        <div className="mb-8">
            <h3 className="mb-4">Расходы по категориям</h3>
            <div className="bg-muted/30 rounded-2xl p-6">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={expenseData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="amount"
                        >
                            {expenseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3 mt-4">
                    {expenseData.map((item) => {
                        return (
                            <div key={item.category} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <div className="flex-1">
                                    <p className="text-sm">{item.category}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.amount.toLocaleString("ru-RU")} {currency}
                                    </p>
                                </div>
                            </div>
                        )

                    })}
                </div>
            </div>
        </div>
    )
}

export default ExpenseChart