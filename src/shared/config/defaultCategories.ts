import food from "@/assets/icons/expenses/food.png";
import car from "@/assets/icons/expenses/car.png";
import home from "@/assets/icons/expenses/home.png";
import restaurant from "@/assets/icons/expenses/restaurant.png";
import sparkles from "@/assets/icons/expenses/sparkles.png";
import trendingup from "@/assets/icons/incomes/trendingup.png";
import type { TransactionType } from "../../shared/lib/transactionType";


export interface Category {
  id: number;
  type: TransactionType["type"];
  category: string;
  iconUrl: string;
  budgetType?: 'needs' | 'wants' | 'savings' | '';
}

export const defaultCategories: Category[] = [
  { id: 1, category: "Food", iconUrl: food, type: "expense", budgetType: 'needs' },
  { id: 2, category: "Transport", iconUrl: car, type: "expense", budgetType: 'needs' },
  { id: 3, category: "Housing", iconUrl: home, type: "expense", budgetType: 'needs' },
  { id: 4, category: "Restaurants", iconUrl: restaurant, type: "expense", budgetType: 'wants' },
  { id: 5, category: "Other", iconUrl: sparkles, type: "expense", budgetType: 'wants' },
  { id: 6, category: "Income", iconUrl: trendingup, type: "income" },
  { id: 7, category: "Crypto", iconUrl: trendingup, type: "expense", budgetType: 'savings' },
];
