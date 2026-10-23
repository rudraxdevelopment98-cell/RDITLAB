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
      padding: { DEFAULT: '1.25rem', md: '2rem', lg: '2.5rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      fontFamily: {
        // Editorial: serif display + clean sans body.
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Warm amber accent
        brand: {
          50: '#fdf7ee',
          100: '#f7e8d2',
          200: '#efcea0',
          300: '#e6b06c',
          400: '#dc9240',
          500: '#c97a22',
          600: '#b45309',
          700: '#8f3f0c',
          800: '#73330f',
          900: '#5e2b10',
        },
        // Warm graphite / charcoal neutrals
        ink: {
          50: '#f6f3ee',
          100: '#e9e3d8',
          200: '#cfc6b7',
          300: '#a99d8c',
          400: '#7c7161',
          500: '#574e42',
          600: '#3c352d',
          700: '#2a241e',
          800: '#201a15',
          900: '#171310',
          950: '#0f0c0a',
        },
      },
      boxShadow: {
        // Soft, flat, editorial shadows (no glow)
        card: '0 1px 2px rgba(28,24,20,0.04), 0 10px 30px -18px rgba(28,24,20,0.25)',
        'card-hover': '0 2px 4px rgba(28,24,20,0.05), 0 20px 50px -24px rgba(28,24,20,0.35)',
        brand: '0 1px 2px rgba(28,24,20,0.04), 0 10px 30px -18px rgba(28,24,20,0.25)',
        'brand-lg': '0 2px 4px rgba(28,24,20,0.05), 0 20px 50px -24px rgba(28,24,20,0.35)',
        glow: '0 2px 4px rgba(28,24,20,0.05), 0 20px 50px -24px rgba(28,24,20,0.35)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
