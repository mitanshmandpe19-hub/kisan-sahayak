/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kisan: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
          },
          cream: {
            50: '#fdfbf7',
            100: '#f8f4ed',
            200: '#eee5d5',
            300: '#dfd2bc',
          },
          soil: {
            600: '#785338',
            700: '#5c3f2b',
            800: '#432d1e',
            900: '#2c1e13',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(22, 101, 52, 0.12), 0 2px 6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
