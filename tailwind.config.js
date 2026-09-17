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
        hand: ['"LiebeHeide"', '"Caveat"', '"Marck Script"', 'cursive'],
        serif: ['"Caveat"', 'Georgia', 'serif'],
        sans: ['"Nunito"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }], // 11px
        '3xs': ['0.625rem', { lineHeight: '0.75rem' }],   // 10px
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      boxShadow: {
        'pencil': '1.5px 2px 0px 0px rgba(87, 74, 64, 0.28)',
        'pencil-sm': '1px 1.5px 0px 0px rgba(87, 74, 64, 0.22)',
        'pencil-lg': '2.5px 3.5px 0px 0px rgba(87, 74, 64, 0.35)',
        'pencil-dark': '1.5px 2px 0px 0px rgba(237, 229, 221, 0.18)',
        'pencil-hover': '2px 2.5px 0px 0px rgba(87, 74, 64, 0.4)',
      },
      colors: {
        brand: {
          50: '#fdf2f6',
          100: '#fce7ef',
          200: '#f9cfe0',
          300: '#f4a7c6',
          400: '#eb71a2',
          500: '#D7195F', // Primary Vivid Berry
          600: '#c01252',
          700: '#a10e44',
          800: '#850f39',
          900: '#701132',
          start: '#9123A6',
          end: '#D7195F',
        },
        primary: {
          DEFAULT: '#D7195F',
          start: '#9123A6',
          end: '#D7195F',
        },
        parchment: {
          50: '#fdfbf7',
          100: '#faf6f0',
          200: '#f4ece1',
          300: '#e8dbca',
          400: '#d5c2ab',
          500: '#ba9f83',
          800: '#3a312a',
          900: '#26201b',
        },
        charcoal: {
          700: '#453a32',
          800: '#2d2621',
          900: '#1c1917',
          950: '#141210',
        },
        body: {
          light: '#fbf1eb',
          border: '#e8aa90',
          accent: '#c85a32',
          darkBg: '#341d14',
          darkBorder: '#6d3620',
          badge: '#c85a32',
        },
        mind: {
          light: '#fdf7ea',
          border: '#f2cf87',
          accent: '#c97a1e',
          darkBg: '#2f2310',
          darkBorder: '#64481b',
          badge: '#c97a1e',
        },
        soul: {
          light: '#fbf0f3',
          border: '#e8a5b8',
          accent: '#b84d68',
          darkBg: '#31161f',
          darkBorder: '#68283a',
          badge: '#b84d68',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #9123A6 0%, #D7195F 100%)',
        'brand-gradient-r': 'linear-gradient(to right, #9123A6, #D7195F)',
        'brand-gradient-tr': 'linear-gradient(to top right, #9123A6, #D7195F)',
        'brand-gradient-hover': 'linear-gradient(135deg, #811e94 0%, #c01252 100%)',
        'primary-gradient': 'linear-gradient(to right, #9123A6, #D7195F)',
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

