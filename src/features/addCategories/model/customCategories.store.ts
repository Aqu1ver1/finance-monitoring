import type { LucideIcon } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
    id: string;
    type: 'income' | 'expense';
    category: string;
    icon: LucideIcon;
    color: string;
}

interface CategoriesStore {
    categories: Category[];
    addCategory: (category: Omit<Category, 'id'>) => void;
    getCategory: () => Category[];
}

export const useCategoriesStore = create<CategoriesStore>()(
    persist(
        (set, get) => ({
            categories: [],
            addCategory: (category: Omit<Category, 'id'>) => {
                set((state) => {
                    const newCategory: Category = {
                        ...category,
                        id: state.categories.length > 0
                            ? (Math.max(...state.categories.map(t => parseInt(t.id))) + 1).toString()
                            : "1",
                    };
                    return {
                        categories: [newCategory, ...state.categories],
                    };
                });
            },
            getCategory:() => get().categories,
        }),

        {
            name: 'categories-storage',
            version: 1,
        }
    )
);
