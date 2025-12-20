import type { LucideIcon } from "lucide-react";
import { ShoppingCart, Home as HomeIcon, Car, Coffee, Sparkles, TrendingUp } from "lucide-react";

interface Category {
  id: string;
  category: string;
  icon: LucideIcon;
  color: string;
}

export const categories: Category[] = [
  { id: "food", category: "Еда", icon: ShoppingCart, color: "#3B82F6" },
  { id: "transport", category: "Транспорт", icon: Car, color: "#10B981" },
  { id: "home", category: "Жильё", icon: HomeIcon, color: "#F59E0B" },
  { id: "entertainment", category: "Развлечения", icon: Coffee, color: "#8B5CF6" },
  { id: "other", category: "Прочее", icon: Sparkles, color: "#EC4899" },
  { id: "income", category: "Доход", icon: TrendingUp, color: "#10B981" },
];

export const getIdByCategory = (categoryName: string): Category | undefined => {
  return categories.find((cat) => cat.id === categoryName);
};

export const getCategoryIcon = (categoryIcon: string): LucideIcon => {
  return getIdByCategory(categoryIcon)?.icon || Sparkles;
};

export const getCategoryColor = (categoryName: string): string => {
  return getIdByCategory(categoryName)?.color || "#EC4899";
};
