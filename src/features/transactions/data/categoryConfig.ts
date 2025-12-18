import type { LucideIcon } from "lucide-react";
import { ShoppingCart, Home as HomeIcon, Car, Coffee, Sparkles, TrendingUp } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export const categories: Category[] = [
  { id: "food", name: "Еда", icon: ShoppingCart, color: "#3B82F6" },
  { id: "transport", name: "Транспорт", icon: Car, color: "#10B981" },
  { id: "home", name: "Жильё", icon: HomeIcon, color: "#F59E0B" },
  { id: "entertainment", name: "Развлечения", icon: Coffee, color: "#8B5CF6" },
  { id: "other", name: "Прочее", icon: Sparkles, color: "#EC4899" },
  { id: "income", name: "Доход", icon: TrendingUp, color: "#10B981" },
];

export const getCategoryByName = (categoryName: string): Category | undefined => {
  return categories.find((cat) => cat.name === categoryName);
};

export const getCategoryIcon = (categoryName: string): LucideIcon => {
  return getCategoryByName(categoryName)?.icon || Sparkles;
};

export const getCategoryColor = (categoryName: string): string => {
  return getCategoryByName(categoryName)?.color || "#EC4899";
};
