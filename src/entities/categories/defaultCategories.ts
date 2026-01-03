import food from "@/assets/icons/expenses/food.png";
import car from "@/assets/icons/expenses/car.png";
import home from "@/assets/icons/expenses/home.png";
import restaurant from "@/assets/icons/expenses/restaurant.png";
import sparkles from "@/assets/icons/expenses/sparkles.png";
import trendingup from "@/assets/icons/incomes/trendingup.png";
import type { Category } from "./categoryConfig";

export const categories: Category[] = [
  { id: 1, category: "Еда", iconUrl: food, type: "expense", color: "#FF6384" },
  { id: 2, category: "Транспорт", iconUrl: car, type: "expense", color: "#36A2EB" },
  { id: 3, category: "Жильё", iconUrl: home, type: "expense", color: "#FFCE56" },
  { id: 4, category: "Развлечения", iconUrl: restaurant, type: "expense", color: "#4BC0C0" },
  { id: 5, category: "Прочее", iconUrl: sparkles, type: "expense", color: "#9966FF" },
  { id: 6, category: "Доход", iconUrl: trendingup, type: "income", color: "#FF9F40" },
];
