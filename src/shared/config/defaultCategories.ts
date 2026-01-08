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
  { id: 1, category: "Еда", iconUrl: food, type: "expense", budgetType: 'needs' },
  { id: 2, category: "Транспорт", iconUrl: car, type: "expense", budgetType: 'needs' },
  { id: 3, category: "Жильё", iconUrl: home, type: "expense", budgetType: 'needs' },
  { id: 4, category: "Развлечения", iconUrl: restaurant, type: "expense", budgetType: 'wants' },
  { id: 5, category: "Прочее", iconUrl: sparkles, type: "expense", budgetType: 'wants' },
  { id: 6, category: "Доход", iconUrl: trendingup, type: "income" },
];
