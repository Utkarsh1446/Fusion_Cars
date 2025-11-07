'use client';

import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * ThemeToggle Component
 *
 * Button to toggle between light and dark themes
 * Displays sun icon for light theme, moon icon for dark theme
 *
 * Note: This is a client-only component to avoid SSR hydration issues
 */
export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-5 h-5" />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 rounded-lg transition-colors duration-300 hover:bg-neutral-light dark:hover:bg-neutral-dark"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0.8 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isDark ? (
          <Moon
            className="w-5 h-5 text-accent-orange"
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <Sun
            className="w-5 h-5 text-accent-orange"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </motion.button>
  );
}
