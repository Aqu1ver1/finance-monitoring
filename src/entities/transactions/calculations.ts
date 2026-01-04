export interface Transaction {
    type: number; // 1 или -1
    amount: number;
}

// Или все сразу одной функцией (эффективнее - один проход)
export const calculateTransactionSummary = (transactions: Transaction[]) => {
    const summary = transactions.reduce(
        (acc, item) => {
            if (item.type > 0) {
                acc.income += item.amount;
            } else {
                acc.expenses += Math.abs(item.amount);
            }
            return acc;
        },
        { income: 0, expenses: 0 }
    );

    return {
        ...summary,
        balance: summary.income - summary.expenses
    };
};