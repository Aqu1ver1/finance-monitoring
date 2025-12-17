import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (dark: boolean) => {
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setIsDark(dark);
    };

    if (savedTheme === 'dark') {
      applyTheme(true);
    } else if (savedTheme === 'light') {
      applyTheme(false);
    } else {
      applyTheme(prefersDark.matches);
    }

    const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
    prefersDark.addEventListener('change', listener);

    return () => prefersDark.removeEventListener('change', listener);
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      const root = window.document.documentElement;
      if (next) root.classList.add('dark');
      else root.classList.remove('dark');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return { isDark, toggle };
};
