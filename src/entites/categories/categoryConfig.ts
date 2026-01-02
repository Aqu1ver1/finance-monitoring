
import { categories } from "./defaultCategories";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { availableIcons } from "./defaultCategories";

export interface Category {
  id: string;
  type: "income" | "expense";
  category: string;
  iconName: string;
  color: string;
}
export const getIdByCategory = (categoryName: string): Category | undefined => {
  return categories.find((cat) => cat.id === categoryName);
};

export const getCategoryIconComponent = (categoryId: string): LucideIcon => {
  const cat = getIdByCategory(categoryId);
  if (!cat) return Sparkles;
  return availableIcons.find((i) => i.name === cat.iconName)?.icon || Sparkles;
};

export const getCategoryColor = (categoryName: string): string => {
  return getIdByCategory(categoryName)?.color || "#EC4899";
};
