import React, { createContext, useState, useEffect, useCallback } from 'react';

/**
 * ThemeContext
 * Manages dark/light theme state and provides theme utilities
 */
export const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Wraps the application to provide theme functionality
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((newTheme) => {
    const html = document.documentElement;

    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    localStorage.setItem('theme', newTheme);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Custom hook to access theme context
 */
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Return default context during SSR/before mounting
    return {
      theme: 'light',
      toggleTheme: () => {},
      isDark: false,
      isLight: true,
    };
  }
  return context;
}
