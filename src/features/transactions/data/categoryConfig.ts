import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import type { Category } from "../../../shared/types/types";
import { categories } from "../../addCategories/model/defaultCategories";

export const getIdByCategory = (categoryName: string): Category | undefined => {
  return categories.find((cat) => cat.id === categoryName);
};

export const getCategoryIcon = (categoryIcon: string): LucideIcon => {
  return getIdByCategory(categoryIcon)?.icon || Sparkles;
};

export const getCategoryColor = (categoryName: string): string => {
  return getIdByCategory(categoryName)?.color || "#EC4899";
};
