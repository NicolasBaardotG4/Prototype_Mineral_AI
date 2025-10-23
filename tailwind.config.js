/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        background: '#F7F3EB',
        surface: '#FFFFFF',
        text: '#0B0B0C',
        subtle: '#6B6B6B',
        divider: 'rgba(11, 11, 12, 0.12)',
        accent: '#C8A96A',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        numeric: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        pill: '999px',
      },
      boxShadow: {
        panel: '0 24px 50px rgba(11, 11, 12, 0.06)',
        inset: 'inset 0 0 0 1px rgba(11, 11, 12, 0.06)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseOutline: {
          '0%': { boxShadow: '0 0 0 0 rgba(200, 169, 106, 0.4)' },
          '70%': { boxShadow: '0 0 0 6px rgba(200, 169, 106, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(200, 169, 106, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 400ms ease-out forwards',
        pulseOutline: 'pulseOutline 800ms ease-out',
      },
    },
  },
  plugins: [],
};
