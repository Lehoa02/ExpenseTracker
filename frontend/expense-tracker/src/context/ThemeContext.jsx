import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'expense-tracker-theme';
const THEME_TRANSITION_DURATION = 1000;

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  setTheme: () => {},
  toggleTheme: () => {},
  isTransitioning: false,
});

const getThemeTransitionGeometry = (originX, originY) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return {
    originX,
    originY,
    radius: Math.max(
      Math.hypot(originX, originY),
      Math.hypot(viewportWidth - originX, originY),
      Math.hypot(originX, viewportHeight - originY),
      Math.hypot(viewportWidth - originX, viewportHeight - originY),
    ) + 24,
  };
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'light';
    } catch {
      return 'light';
    }
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = (origin) => {
    if (isTransitioning) {
      return;
    }

    const nextTheme = theme === 'light' ? 'dark' : 'light';

    if (!origin || typeof window === 'undefined' || typeof document === 'undefined') {
      setTheme(nextTheme);
      return;
    }

    const { originX, originY, radius } = getThemeTransitionGeometry(origin.x, origin.y);
    const root = document.documentElement;

    root.style.setProperty('--theme-transition-origin-x', `${originX}px`);
    root.style.setProperty('--theme-transition-origin-y', `${originY}px`);
    root.style.setProperty('--theme-transition-radius', `${radius}px`);
    root.style.setProperty('--theme-transition-duration', `${THEME_TRANSITION_DURATION}ms`);

    if (typeof document.startViewTransition !== 'function') {
      root.removeAttribute('data-theme-transition');
      setTheme(nextTheme);
      return;
    }

    setIsTransitioning(true);
    root.setAttribute('data-theme-transition', nextTheme);

    const viewTransition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    viewTransition.finished.finally(() => {
      setIsTransitioning(false);
      root.removeAttribute('data-theme-transition');
    });
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme,
      isTransitioning,
    }),
    [theme, isTransitioning],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
