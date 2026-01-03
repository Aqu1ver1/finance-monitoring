export interface Transaction {
    type: number; // 1 или -1
    amount: number;
}

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
    return transactions.reduce(
        (sum, item) => item.type < 0 ? sum + Math.abs(item.amount) : sum, 
        0
    );
};

export const calculateTotalIncome = (transactions: Transaction[]): number => {
    return transactions.reduce(
        (sum, item) => item.type > 0 ? sum + item.amount : sum, 
        0
    );
};

// Бонус: общая функция для баланса
export const calculateBalance = (transactions: Transaction[]): number => {
    return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

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