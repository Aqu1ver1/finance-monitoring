import { useMemo } from 'react'
import type { Category } from '../../../shared/config/defaultCategories';
import type { Transaction } from '../../../entities/transactions/transactions.store';

type AdviseSectionProps = {
    allCategories: Category[];
    transactions: Transaction[];
    t: (key: string) => string;
    currency: string;
}

export const useTransactionsForAdvice = ({ allCategories, transactions, t, currency }: AdviseSectionProps) => useMemo(() => {
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
            } as const;
        })
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 80);
}, [transactions, allCategories, t, currency]);