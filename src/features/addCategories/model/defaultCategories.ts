import type { Category } from "../../../shared/types/types";
import { Coffee, Car, HomeIcon, ShoppingCart, Sparkles, TrendingUp, Utensils } from "lucide-react";

export const categories: Category[] = [
  { id: "food", category: "Еда", iconName: "ShoppingCart", type: "expense", color: "#3B82F6" },
  { id: "transport", category: "Транспорт", iconName: "Car", type: "expense", color: "#10B981" },
  { id: "home", category: "Жильё", iconName: "HomeIcon", type: "expense", color: "#F59E0B" },
  { id: "entertainment", category: "Развлечения", iconName: "Coffee", type: "expense", color: "#8B5CF6" },
  { id: "other", category: "Прочее", iconName: "Sparkles", type: "expense", color: "#EC4899" },
  { id: "income", category: "Доход", iconName: "TrendingUp", type: "income", color: "#10B981" },
];

export const availableIcons = [
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Car", icon: Car },
    { name: "HomeIcon", icon: HomeIcon },
    { name: "Coffee", icon: Coffee },
    { name: "Sparkles", icon: Sparkles },
    { name: "Utensils", icon: Utensils },
    { name: "TrendingUp", icon: TrendingUp },
];

export const availableColors = [
  { name: "Синий", value: "#3B82F6" },
  { name: "Зеленый", value: "#10B981" },
  { name: "Оранжевый", value: "#F59E0B" },
  { name: "Фиолетовый", value: "#8B5CF6" },
  { name: "Розовый", value: "#EC4899" },
  { name: "Красный", value: "#EF4444" },
  { name: "Голубой", value: "#06B6D4" },
];