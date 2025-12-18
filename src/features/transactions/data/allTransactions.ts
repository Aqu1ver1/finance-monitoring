interface TransactionsState {
    id: number;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description?: string;
    date: string;
}
export const allTransactions: TransactionsState[] = [
  {
    id: 1,
    category: "Доход",
    type: "income",
    amount: 75000,
    date: "15 дек",
    description: "Зарплата",
  },
  {
    id: 2,
    category: "Жильё",
    amount: -25000,
    type: "expense",
    date: "14 дек",
    description: "Аренда квартиры",
  },
  {
    id: 3,
    category: "Еда",
    amount: -1250,
    type: "expense",
    date: "14 дек",
    description: "Продукты",
  },
  {
    id: 4,
    category: "Еда",
    type: "expense",
    amount: -890,
    date: "13 дек",
    description: "Кафе",
  },
  {
    id: 5,
    category: "Транспорт",
    amount: -350,
    type: "expense",
    date: "13 дек",
    description: "Такси",
  },
  {
    id: 6,
    category: "Развлечения",
    amount: -800,
    type: "expense",
    date: "12 дек",
    description: "Кино",
  },
];