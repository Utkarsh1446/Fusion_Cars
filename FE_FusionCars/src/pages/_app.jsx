import '../styles/globals.css';
import { useEffect } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';

/**
 * Next.js App Component
 *
 * Global configuration for the application:
 * - Global styles
 * - Theme provider
 * - Head management
 * - Layout wrappers
 */
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Prevent layout shift by ensuring smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <ThemeProvider>
      {/* Global Page Title and Meta */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
