import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category } from '../../shared/config/defaultCategories';
import { defaultCategories } from '../../shared/config/defaultCategories';

interface CategoriesStore {
    categories: Category[];
    addCategory: (category: Omit<Category, 'id'>) => void;
    deleteCategory: (id: number) => void;
    editCategory: (id: number, updates: Partial<Omit<Category, 'id'>>) => void;
}

export const useCustomCategoriesStore = create<CategoriesStore>()(
    persist(
        (set) => ({
            categories: [],

            addCategory: (category) =>
                set((state) => {
                    // Генерируем уникальный ID
                    const nextId = state.categories.length > 0
                        ? Math.max(...state.categories.map(c => c.id)) + 1
                        : defaultCategories.length + 1;

                    const newCategory: Category = {
                        ...category,
                        id: nextId,
                    };

                    return {
                        categories: [...state.categories, newCategory],
                    };
                }),
            editCategory: (id, updates) =>
                set((state) => ({
                    categories: state.categories.map((cat) =>
                        cat.id === id ? { ...cat, ...updates } : cat
                    )
                })),
            deleteCategory: (id) =>
                set((state) => ({
                    categories: state.categories.filter(cat => cat.id !== id),
                })),
        }),
        {
            name: 'categories-storage',
            version: 1,
        }
    )
);
