import React from 'react'
import { getCategoryIcon, getCategoryColor } from "../../features/transactions/data/categoryConfig";
import { useCurrencyStore } from "../../features/settings/currency/model/currency.store";
import type { Transaction } from "../../features/transactions/model/transactions.store";

interface Props {
  transaction: Transaction;
}

const CategoryTransactions: React.FC<Props> = ({ transaction }) => {
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const Icon = getCategoryIcon(transaction.category);
  const color = getCategoryColor(transaction.category);

  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color: color }} />
      </div>
      <div className="flex-1 min-w-0 text-primary">
        <p className="truncate">{transaction.description}</p>
        <p className="text-sm ">{transaction.category}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
          {transaction.amount > 0 ? "+" : ""}
          {transaction.amount.toLocaleString("ru-RU")} {currency}
        </p>
        <p className="text-sm text-primary">{transaction.date}</p>
      </div>
    </div>
  );
}

export default CategoryTransactions