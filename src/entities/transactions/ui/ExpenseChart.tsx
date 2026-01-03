import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useCurrencyStore } from "../../currency/currency.store";
import { useTransactionsStore } from '../transactions.store';
import { categories } from '../../categories/defaultCategories';

type ExpenseItem = {
    id_category: number;
    amount: number;
    color: string;
    category: string;
};

const ExpenseChart = () => {
    const transactions = useTransactionsStore((state) => state.transactions);
    const currency = useCurrencyStore(state => state.selectedCurrency);

    const expenseData: ExpenseItem[] = useMemo(() => {
        const map = new Map<number, ExpenseItem>();

        for (const item of transactions) {
            if (item.type !== -1) continue;

            const category = transactions.find(cat => cat.id_category === item.id_category)
                ? categories.find(cat => cat.id === item.id_category && cat.type === "expense")
                : null;
            const color = category?.color || '#CCCCCC';
            const prev = map.get(item.id_category);

            if (prev) {
                prev.amount += Math.abs(item.amount);
            } else {
                map.set(item.id_category, {
                    id_category: item.id_category,
                    amount: Math.abs(item.amount),
                    color: color,
                    category: category ? category.category : 'Без категории',
                });
            }
        }

        const aggregated = Array.from(map.values());
        if (aggregated.length === 0) {
            return [{
                id_category: -1,
                category: 'Нет расходов',
                amount: 1,
                color: '#E0E0E0',
            }];
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
                            <div key={item.id_category} className="flex items-center gap-2">
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