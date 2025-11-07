/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary colors - Black & Grayscale Luxury Theme
        primary: {
          navy: '#0b132b',        // Primary navy blue for backgrounds
          black: '#0A0A0A',       // Pure black for primary backgrounds
          dark: '#1A1A1A',        // Dark gray for secondary backgrounds
          charcoal: '#2A2A2A',    // Medium dark gray for tertiary backgrounds
        },
        // Accent colors - Blue & Orange with Grayscale
        accent: {
          blue: '#007bff',        // Primary accent blue
          orange: '#ff6700',      // Secondary accent orange
          silver: '#D1D5DB',      // Silver accent (primary highlights)
          platinum: '#E5E7EB',    // Platinum for secondary accents
          charcoal: '#374151',    // Dark gray for text accents
          stone: '#6B7280',       // Stone gray for subtle elements
        },
        // Neutral colors - Grayscale Range
        neutral: {
          white: '#FFFFFF',       // Pure white for text
          light: '#F3F4F6',       // Very light gray
          gray: '#D1D5DB',        // Silver gray
          dark: '#1F2937',        // Dark gray
          darker: '#111827',      // Very dark gray
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'Manrope', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
