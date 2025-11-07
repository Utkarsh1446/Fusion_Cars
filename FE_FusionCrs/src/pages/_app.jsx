import '../styles/globals.css';
import { useEffect } from 'react';

/**
 * Next.js App Component
 *
 * Global configuration for the application:
 * - Global styles
 * - Head management
 * - Analytics (optional)
 * - Layout wrappers
 */
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Prevent layout shift by ensuring smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <>
      {/* Global Page Title and Meta */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
