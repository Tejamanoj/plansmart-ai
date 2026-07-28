import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

const THEME_KEY = 'plansmart_theme';

/**
 * useTheme — reads system preference and persists user toggle to localStorage.
 *
 * Strategy:
 *  1. On first load, read from localStorage.
 *  2. If not set, fall back to OS-level prefers-color-scheme.
 *  3. Apply the class to <html> so Tailwind dark: utilities activate.
 *  4. Persist choice on every toggle.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // localStorage unavailable (private browsing etc.)
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Storage write failed — fail silently
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
