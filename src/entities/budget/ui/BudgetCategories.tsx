import { useMemo } from 'react'
import CircularProgress from "../../../shared/ui/CircularProgress";
import { useCurrencyStore } from '../../../features/currency/currency.store';
import { useTransactionsStore } from '../../transactions/transactions.store';
import { useBudgetStore } from '../../../features/addBudget/budget.store';
import { defaultCategories } from '../../../shared/config/defaultCategories';
import { BUDGET_SCHEMES } from '../../../features/addBudget/budgetConfig';
import {useCustomCategoriesStore} from "../../../features/customCategories/customCategories.store";
import { useTranslate } from "../../../features/swapLanguages/useTranslate";

import needsIcon from '../../../assets/icons/budget_types/requirement.png';
import wantsIcon from '../../../assets/icons/budget_types/beach-vacation.png';
import savingsIcon from '../../../assets/icons/budget_types/piggy-bank.png';

type BudgetType = 'needs' | 'wants' | 'savings';

type BudgetCategoryData = {
    type: BudgetType;
    name: string;
    amount: number;
    limit: number;
    color: string;
    iconUrl: string;
};

const BUDGET_TYPE_CONFIG: Record<BudgetType, { name: string; iconUrl: string; color: string }> = {
    needs: { name: 'Needs', iconUrl: needsIcon, color: '#3B82F6' },
    wants: { name: 'Wants', iconUrl: wantsIcon, color: '#8B5CF6' },
    savings: { name: 'Savings', iconUrl: savingsIcon, color: '#10B981' }
};

const BudgetCategories = ({ scheme }: { scheme: string }) => {
    const { budget } = useBudgetStore();
    const transactions = useTransactionsStore(state => state.transactions);
    const currency = useCurrencyStore(state => state.selectedCurrency);
    const { create_date } = useBudgetStore();
    const selectedScheme = scheme ? BUDGET_SCHEMES[scheme] : undefined;
    const t = useTranslate();

    const budgetData: BudgetCategoryData[] = useMemo(() => {
        if (!selectedScheme) return [];

        // Group transactions by budget types
        const expensesByType: Record<BudgetType, number> = {
            needs: 0,
            wants: 0,
            savings: 0
        };

        for (const transaction of transactions) {
            // Только расходы (type === -1)
            if (transaction.type !== -1) continue;

            // Фильтр по дате (текущий месяц)
            if (create_date) {
                const transactionDate = new Date(transaction.date);
                const budgetDate = new Date(create_date);
                if (
                    transactionDate.getMonth() !== budgetDate.getMonth() ||
                    transactionDate.getFullYear() !== budgetDate.getFullYear()
                ) {
                    continue;
                }
            }

            // Находим категорию и её budget_type
            const customCategory = useCustomCategoriesStore.getState().categories;
            const category = [...defaultCategories, ...customCategory].find(cat => cat.id === transaction.id_category);
            if (category && category.type === 'expense' && category.budgetType) {
                expensesByType[category.budgetType] += Math.abs(transaction.amount);
            }
        }

        // Формируем данные для каждого типа бюджета
        return (['needs', 'wants', 'savings'] as BudgetType[]).map(type => ({
            type,
            name: t(`budgetCategories.types.${type}`),
            amount: expensesByType[type],
            limit: (budget * selectedScheme[type]) / 100,
            color: BUDGET_TYPE_CONFIG[type].color,
            iconUrl: BUDGET_TYPE_CONFIG[type].iconUrl
        }));
    }, [transactions, defaultCategories, create_date, budget, selectedScheme, t]);

    return (
        <>
            {budgetData.map((categoryData) => {
                const percentage = categoryData.limit > 0 
                    ? (categoryData.amount / categoryData.limit) * 100 
                    : 0;
                const isOverBudget = percentage > 100;

                return (
                    <div
                        key={categoryData.type}
                        className="bg-muted/30 rounded-2xl"
                    >
                        <div className="flex items-center gap-4 p-4 ">
                            <CircularProgress
                                percentage={percentage}
                                color={isOverBudget ? "#EF4444" : categoryData.color}
                            />
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${categoryData.color}15` }}
                                        >
                                            <img 
                                                src={categoryData.iconUrl} 
                                                alt={categoryData.name} 
                                                className="w-4 h-4" 
                                            />
                                        </div>
                                        <p className="font-medium">{categoryData.name}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t("budgetCategories.labels.spent")}</span>
                                        <span className={isOverBudget ? "text-red-600" : ""}>
                                            {categoryData.amount.toLocaleString("ru-RU")} {currency}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t("budgetCategories.labels.limit")}</span>
                                        <span>{categoryData.limit.toLocaleString("ru-RU")} {currency}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t("budgetCategories.labels.remaining")}</span>
                                        <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                                            {(categoryData.limit - categoryData.amount).toLocaleString("ru-RU")} {currency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    )
}

export default BudgetCategories