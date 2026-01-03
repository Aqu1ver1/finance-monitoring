// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import type { Category } from '../../entites/categories/defaultCategories';

// interface CategoriesStore {
//     categories: Category[];
//     addCategory: (category: Omit<Category, 'id'>) => void;
//     getCategory: () => Category[];
// }

// export const useCategoriesStore = create<CategoriesStore>()(
//     persist(
//         (set, get) => ({
//             categories: [],
//             addCategory: (category) =>
//                 set((state) => ({
//                     categories: [
//                         { ...category, id: crypto.randomUUID() },
//                         ...state.categories,
//                     ],
//                 })),
//             getCategory: () => get().categories,
//         }),
//         {
//             name: 'categories-storage',
//             version: 1,
//         }
//     )
// );
