import { useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useCurrencyStore } from "../../currency/currency.store";
import { useTransactionsStore } from '../../../entities/transactions/transactions.store';
import { defaultCategories } from '../../../shared/config/defaultCategories';
import { useCustomCategoriesStore } from '../../customCategories/customCategories.store';
import { useTranslate } from "../../swapLanguages/useTranslate";
import { usePersistentColors } from '../usePersistentColors';
import { useExpenseData } from '../useExpenseData';

const ExpenseChart = () => {
    const transactions = useTransactionsStore((state) => state.transactions);
    const currency = useCurrencyStore(state => state.selectedCurrency);
    const customCategories = useCustomCategoriesStore(state => state.categories);
    const t = useTranslate();

    const allCategories = useMemo(
        () => [...defaultCategories, ...customCategories],
        [customCategories]
    );

    const { getColorForCategory } = usePersistentColors();

    const translateCategory = useCallback(
        (categoryName: string): string => {
            const key = `categories.${categoryName}`;
            const translated = t(key);
            return translated === key ? categoryName : translated;
        },
        [t]
    );

    const expenseData = useExpenseData({
        transactions,
        allCategories,
        getColorForCategory,
        translateCategory,
        noExpensesLabel: t("expenseChart.noExpenses"),
    });
    return (
        <div className="mb-8">
            <h3 className="mb-4">{t("expenseChart.title")}</h3>
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
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="dark:gray-500 #E0E0E0" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-4">
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