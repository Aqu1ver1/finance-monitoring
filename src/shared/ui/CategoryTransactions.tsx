import React, { useState } from 'react'
import { ShoppingCart, Car, Home as HomeIcon, Coffee, Sparkles, TrendingUp } from "lucide-react";

const categories = [
    { id: "food", name: "Еда", icon: ShoppingCart, color: "#3B82F6" },
    { id: "transport", name: "Транспорт", icon: Car, color: "#10B981" },
    { id: "home", name: "Жильё", icon: HomeIcon, color: "#F59E0B" },
    { id: "entertainment", name: "Развлечения", icon: Coffee, color: "#8B5CF6" },
    { id: "other", name: "Прочее", icon: Sparkles, color: "#EC4899" },
    { id: "income", name: "Доход", icon: TrendingUp, color: "#10B981" },
];

const CategoryTransactions = ({ type }: { type: "expense" | "income" }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredCategories = categories.filter((cat) =>
        type === "income" ? cat.id === "income" : cat.id !== "income"
    );

    return (
        <div className="grid grid-cols-3 gap-3">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl transition-all ${
                    isSelected
                      ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                      : "bg-muted/30"
                  }`}
                >
                  <Icon
                    className="w-6 h-6 mx-auto mb-2"
                    style={{ color: isSelected ? "currentColor" : category.color }}
                  />
                  <p className="text-xs text-center">{category.name}</p>
                </button>
              );
            })}
          </div>
    )
}

export default CategoryTransactions