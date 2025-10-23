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
        background: '#F6EFE4',
        surface: '#FDF9F1',
        surfaceMuted: '#F3E9D8',
        text: '#3B2D1F',
        muted: '#7E6A4C',
        divider: 'rgba(109, 87, 54, 0.24)',
        accent: '#C2A050',
        accentDark: '#9E7B2D',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'serif'],
        numeric: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
        pill: '999px',
      },
      boxShadow: {
        panel: '0 32px 60px rgba(75, 55, 23, 0.08)',
        inset: 'inset 0 0 0 1px rgba(85, 66, 33, 0.08)',
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
