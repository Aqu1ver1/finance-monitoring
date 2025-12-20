import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
      setIsLoaded(true);
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
    setIsDark((prev) => {
      const next = !prev;
      const root = window.document.documentElement;
      if (next) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  if (!isLoaded) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext должен использоваться внутри ThemeProvider');
  }
  return context;
};
