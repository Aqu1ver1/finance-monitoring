// Типы транзакций
import type { TransactionType } from "../../shared/lib/transactionType";

// Категория
export interface Category {
  id: number;
  type: TransactionType["type"];
  category: string;
  iconUrl: string;
  color: string;
  budget_type: 'needs' | 'wants' | 'savings';
}

// Константы для работы с типами
export const TRANSACTION_TYPES: Record<TransactionType["type"], TransactionType> = {
  income: { id: 1, type: "income" },
  expense: { id: -1, type: "expense" }
} as const;

// Утилиты
export const getTypeById = (id: TransactionType["id"]): TransactionType["type"] => 
  id === 1 ? "income" : "expense";

export const calculateAmount = (amount: number, typeId: TransactionType["id"]): number => 
  amount * typeId;