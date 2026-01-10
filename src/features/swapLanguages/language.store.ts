import { create } from 'zustand';

type Lang = 'ru' | 'en';

interface LanguageStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  lang: 'ru',
  setLang: (lang) => set({ lang })
}));
