import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SignUpData } from './ui/sirnUpForm';

export interface User extends SignUpData {
  id: number;
  createdAt: string;
}

interface UserStore {
  user: User | null;
  register: (data: SignUpData) => void;
  updateUser: (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      register: (data) => {
        const newUser: User = {
          ...data,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : state.user,
        })),

      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      version: 1,
      partialize: (state) => ({ user: state.user }),
    }
  )
);
