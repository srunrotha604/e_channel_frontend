import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeContextProvider, { useTheme } from '../context/ThemeContext';

const THEME_KEY = '';
const ThemeConsumer = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        backgroundColor: isDark ? '#121212' : '#f5f5f5',
        color: isDark ? '#ffffff' : '#121212',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'sans-serif',
        transition: 'background-color 0.2s, color 0.2s',
      }}
    >
      <h2>
        Current theme: <span data-testid="theme">{theme}</span>
      </h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          onClick={() => setTheme('dark')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isDark ? '#333' : '#ddd',
            color: isDark ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          set dark
        </button>
        <button
          onClick={() => setTheme('light')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isDark ? '#333' : '#ddd',
            color: isDark ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          set light
        </button>
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isDark ? '#333' : '#ddd',
            color: isDark ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          toggle
        </button>
      </div>
    </div>
  );
};

const renderTheme = async () => {
  await act(async () => {
    render(
      <ThemeContextProvider>
        <ThemeConsumer />
      </ThemeContextProvider>
    );
  });
};

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
};

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('theme-dark');
  mockMatchMedia(false);
});

describe('ThemeContext', () => {
  describe('initial theme', () => {
    it('defaults to light when nothing is persisted and system prefers light', async () => {
      await renderTheme();
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('reads persisted dark from localStorage', async () => {
      localStorage.setItem(THEME_KEY, JSON.stringify('dark'));
      await renderTheme();
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('reads persisted light from localStorage', async () => {
      localStorage.setItem(THEME_KEY, JSON.stringify('light'));
      await renderTheme();
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('uses system dark preference when nothing is persisted', async () => {
      mockMatchMedia(true);
      await renderTheme();
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  describe('DOM class', () => {
    it('adds theme-dark class when initial theme is dark', async () => {
      localStorage.setItem(THEME_KEY, JSON.stringify('dark'));
      await renderTheme();
      expect(document.documentElement).toHaveClass('theme-dark');
    });

    it('does not add theme-dark class when initial theme is light', async () => {
      await renderTheme();
      expect(document.documentElement).not.toHaveClass('theme-dark');
    });
  });

  describe('setTheme', () => {
    it('switches to dark, adds class, and persists', async () => {
      await renderTheme();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'set dark' }));
      });
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(document.documentElement).toHaveClass('theme-dark');
      expect(localStorage.getItem(THEME_KEY)).toBe(JSON.stringify('dark'));
    });

    it('switches to light, removes class, and persists', async () => {
      localStorage.setItem(THEME_KEY, JSON.stringify('dark'));
      await renderTheme();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'set light' }));
      });
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(document.documentElement).not.toHaveClass('theme-dark');
      expect(localStorage.getItem(THEME_KEY)).toBe(JSON.stringify('light'));
    });
  });

  describe('toggleTheme', () => {
    it('switches from light to dark', async () => {
      await renderTheme();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
      });
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('switches from dark to light', async () => {
      localStorage.setItem(THEME_KEY, JSON.stringify('dark'));
      await renderTheme();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
      });
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });
});
