import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Lang = 'ru' | 'en';

interface LanguageStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: 'ru',
      setLang: (lang) => set({ lang })
    }),
    {
      name: 'language-storage',
      version: 1
    }
  )
);
