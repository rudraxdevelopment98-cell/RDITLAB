/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        ink: {
          950: '#08080f',
          900: '#0c0c16',
          800: '#12121f',
          700: '#1a1a2b',
        },
      },
      boxShadow: {
        glow: '0 0 50px -10px rgba(139, 92, 246, 0.55)',
        brand: '0 20px 60px -18px rgba(124, 58, 237, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-light':
          'linear-gradient(to right, rgba(15,18,34,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,18,34,0.05) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)', opacity: '0.7' },
          '33%': { transform: 'translate(40px,-30px) scale(1.15)', opacity: '0.9' },
          '66%': { transform: 'translate(-30px,25px) scale(0.9)', opacity: '0.6' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-15deg)' },
          '60%, 100%': { transform: 'translateX(220%) skewX(-15deg)' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        sheen: 'sheen 3.5s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}
