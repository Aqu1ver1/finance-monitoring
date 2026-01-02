import React, { useState } from 'react'
import { getCategoryIconComponent, getCategoryColor } from "../../categories/categoryConfig";
import { useCurrencyStore } from "../../currency/currency.store";
import type { Transaction } from "../transactions.store";
import { formatDateToText } from '../../../shared/lib/dateFormatter';
import { useTransactionsStore } from '../transactions.store';
import { Trash } from 'lucide-react';

interface Props {
  transaction: Transaction;
}

const TransactionCard: React.FC<Props> = ({ transaction }) => {
  const removeTransaction = useTransactionsStore(state => state.removeTransaction);
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const Icon = getCategoryIconComponent(transaction.category);
  const color = getCategoryColor(transaction.category);
  const formattedDate = transaction.date ? transaction.date.toString().split(' - ').map(d => formatDateToText(d)).join(' - ') : '';
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        <p className="text-sm text-primary">{formattedDate}</p>
      </div>
      {isHovered ? (
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 ml-4 bg-red-200 text-red-700 hover:text-red-800 transition-colors"
            onClick={() => removeTransaction(transaction.id)}
          >
            <Trash className="w-5 h-5" />
          </button>
      ) : null}
    </div>
  );
}

export default TransactionCard;