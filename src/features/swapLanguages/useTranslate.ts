import { useLanguageStore } from './language.store';
import { translations } from './translations';

export const useTranslate = () => {
  const lang = useLanguageStore((s) => s.lang);

  return (key: string): string => {
    const parts = key.split('.');
    let result: any = translations[lang];

    for (const part of parts) {
      result = result?.[part];
    }

    return result ?? key;
  };
};