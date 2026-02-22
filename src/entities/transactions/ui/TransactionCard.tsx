import React, { useState } from 'react'
import { useCurrencyStore } from "../../../features/currency/currency.store";
import type { Transaction } from "../transactions.store";
import { formatDateToText } from '../../../shared/lib/dateFormatter';
import { useTransactionsStore } from '../transactions.store';
import { Trash } from 'lucide-react';
import { defaultCategories } from "../../../shared/config/defaultCategories";
import { useCustomCategoriesStore} from '../../../features/customCategories/customCategories.store'; 
import { useTranslate } from "../../../features/swapLanguages/useTranslate";


interface Props {
  transaction: Transaction;
}

const TransactionCard: React.FC<Props> = ({ transaction }) => {
  const customCategories = useCustomCategoriesStore(state => state.categories);
  const allCategories = [...defaultCategories, ...customCategories];
  const category = allCategories.find(
    cat => cat.id === transaction.id_category
  );
  const iconUrl = category ? category.iconUrl : '';
  const removeTransaction = useTransactionsStore(state => state.removeTransaction);
  const currency = useCurrencyStore(state => state.selectedCurrency);
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslate();
  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
      >
        <img src={iconUrl} alt={iconUrl} className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0 text-primary">
        <p className="truncate">
          {category
            ? (() => {
                const key = `categories.${category.category}`;
                const translated = t(key);
                return translated === key ? category.category : translated;
              })()
            : t("transactionCard.noCategory")}
        </p>
        {transaction.description && (
          <p className="text-sm text-muted-foreground truncate">
            {transaction.description}
          </p>)}
      </div>
      <div className="text-right shrink-0">
        <p className={transaction.type > 0 ? "text-green-600" : "text-red-600"}>
          {transaction.type > 0 ? "+" : ""}
          {(transaction.amount * transaction.type).toLocaleString("ru-RU")} {currency}
        </p>
        <p className="text-sm text-primary">{formatDateToText(new Date(transaction.date))}</p>
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