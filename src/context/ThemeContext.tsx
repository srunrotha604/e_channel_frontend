import React, { createContext, useContext, useEffect, useState } from 'react';
import { getEnv } from '../utils/env';
import { getPersistedState, persistState } from '../utils/persist-util';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

const readInitialTheme = (): Theme => {
  const persisted = getPersistedState(getEnv('VITE_THEME'));
  if (persisted === 'dark' || persisted === 'light') {
    return persisted;
  }
  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
  return systemPrefersDark ? 'dark' : 'light';
};

interface ThemeContextProviderProps {
  children?: React.ReactNode;
}

const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const setTheme = (next: Theme) => {
    persistState(getEnv('VITE_THEME'), next);
    setThemeState(next);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContextProvider;
