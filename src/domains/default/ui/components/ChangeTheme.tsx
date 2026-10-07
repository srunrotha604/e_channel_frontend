import { useEffect, useState } from 'react';
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md';
import {
  getPersistedState,
  persistState,
} from '../../../../utils/persist-util';

const ChangeTheme = () => {
  const [theme, setTheme] = useState<string>('');
  const handleChangeTheme = () => {
    setTheme(() => {
      const getTheme = getPersistedState(import.meta.env.VITE_THEME);
      if (getTheme === 'dark') {
        persistState(import.meta.env.VITE_THEME, 'light');
        return 'light';
      } else {
        persistState(import.meta.env.VITE_THEME, 'dark');
        return 'dark';
      }
    });
  };
  useEffect(() => {
    const getTheme = getPersistedState(import.meta.env.VITE_THEME);
    setTheme(() => {
      if (getTheme) {
        return getTheme;
      } else {
        const systemPrefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        if (systemPrefersDark) {
          return 'dark';
        } else {
          return 'light';
        }
      }
    });
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
    }
  }, [theme]);
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        onClick={handleChangeTheme}
        className="px-2"
        style={{ cursor: 'pointer' }}
      >
        {theme === 'light' ? (
          <MdOutlineDarkMode size={24} />
        ) : (
          <MdDarkMode size={24} />
        )}
      </div>
    </div>
  );
};
export default ChangeTheme;
