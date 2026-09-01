/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }], // 11px
        '3xs': ['0.625rem', { lineHeight: '0.75rem' }],   // 10px
      },
      colors: {
        brand: {
          50: '#fdf4f9',
          100: '#fbe8f3',
          200: '#f8d2e8',
          300: '#f1add4',
          400: '#e578b6',
          500: '#9123A6',
          600: '#7e1c91',
          700: '#681678',
          800: '#551362',
          900: '#380c41',
          start: '#9123A6',
          end: '#D7195F',
        },
        primary: {
          start: '#9123A6',
          end: '#D7195F',
        },
        body: {
          light: '#fdf4ec',
          border: '#f4c7a6',
          accent: '#d97736',
          darkBg: '#2a1a14',
          darkBorder: '#5a3020',
          badge: '#e87332',
        },
        mind: {
          light: '#eff6ff',
          border: '#bfdbfe',
          accent: '#2563eb',
          darkBg: '#132338',
          darkBorder: '#1e3a5f',
          badge: '#3b82f6',
        },
        soul: {
          light: '#fef2f2',
          border: '#fecaca',
          accent: '#dc2626',
          darkBg: '#2b1114',
          darkBorder: '#5c1d24',
          badge: '#ef4444',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #9123A6 0%, #D7195F 100%)',
        'brand-gradient-r': 'linear-gradient(to right, #9123A6, #D7195F)',
        'brand-gradient-tr': 'linear-gradient(to top right, #9123A6, #D7195F)',
        'brand-gradient-hover': 'linear-gradient(135deg, #a32db9 0%, #e6286e 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'progress': 'progress 2.2s ease-in-out forwards',
        'spin-slow': 'spin 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      }
    },
  },
  plugins: [],
}

