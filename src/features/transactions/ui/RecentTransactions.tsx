import React from 'react'
import { ShoppingCart, Car, Home as HomeIcon, Coffee, TrendingUp } from "lucide-react";
import { useCurrencyStore } from '../../settings/currency/model/currency.store';

const recentTransactions = [
    { id: 1, name: "Продукты", category: "Еда", amount: -1250, icon: ShoppingCart, color: "#3B82F6" },
    { id: 2, name: "Зарплата", category: "Доход", amount: 75000, icon: TrendingUp, color: "#10B981" },
    { id: 3, name: "Такси", category: "Транспорт", amount: -350, icon: Car, color: "#10B981" },
    { id: 4, name: "Кафе", category: "Еда", amount: -890, icon: Coffee, color: "#3B82F6" },
    { id: 5, name: "Аренда", category: "Жильё", amount: -25000, icon: HomeIcon, color: "#F59E0B" },
];


const RecentTransactions = () => {
    const currency = useCurrencyStore(state => state.selectedCurrency);
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3>Последние операции</h3>
                <button className="text-sm text-primary">Все</button>
            </div>
            <div className="space-y-3">
                {recentTransactions.map((transaction) => {
                    const Icon = transaction.icon;
                    return (
                        <div
                            key={transaction.id}
                            className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
                        >
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${transaction.color}15` }}
                            >
                                <Icon className="w-5 h-5" style={{ color: transaction.color }} />
                            </div>
                            <div className="flex-1">
                                <p>{transaction.name}</p>
                                <p className="text-sm text-muted-foreground">{transaction.category}</p>
                            </div>
                            <p
                                className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}
                            >
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount.toLocaleString("ru-RU")} {currency}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}

export default RecentTransactions