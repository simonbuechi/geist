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
        hand: ['"Playwrite NO"', 'cursive'],
        sans: ['"Playwrite DE Grund"', 'cursive'],
        serif: ['"Playwrite DE Grund"', 'cursive'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.95rem' }], // 11px
        '3xs': ['0.625rem', { lineHeight: '0.8rem' }],   // 10px
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      boxShadow: {
        'notebook': '2.5px 3.5px 0px 0px rgba(68, 56, 46, 0.14), 0 4px 14px -4px rgba(68, 56, 46, 0.08)',
        'notebook-dark': '2.5px 3.5px 0px 0px rgba(0, 0, 0, 0.38), 0 4px 14px -4px rgba(0, 0, 0, 0.25)',
        'pencil': '2px 2.5px 0px 0px rgba(74, 62, 52, 0.18)',
        'pencil-sm': '1.25px 1.75px 0px 0px rgba(74, 62, 52, 0.15)',
        'pencil-lg': '3px 4px 0px 0px rgba(74, 62, 52, 0.24)',
        'pencil-dark': '1.5px 2px 0px 0px rgba(234, 226, 217, 0.14)',
        'pencil-hover': '2.5px 3px 0px 0px rgba(74, 62, 52, 0.28)',
      },
      colors: {
        paper: {
          desk: '#F3EDE2',
          sheet: '#FCF9F4',
          warm: '#F7F1E7',
          subtle: '#EFE6D8',
          darkDesk: '#191614',
          darkSheet: '#231F1C',
          darkWarm: '#2B2521',
        },
        ink: {
          primary: '#332B25',
          secondary: '#6E6258',
          muted: '#9A8D82',
          darkPrimary: '#EAE2D9',
          darkSecondary: '#A89B8F',
          darkMuted: '#70655B',
        },
        body: {
          light: '#FAF1ED',
          border: '#C46345',
          accent: '#C46345',
          darkBg: '#2C211D',
          darkBorder: '#E2876B',
          badge: '#C46345',
        },
        mind: {
          light: '#F1F6F1',
          border: '#557659',
          accent: '#557659',
          darkBg: '#1E2820',
          darkBorder: '#89B08E',
          badge: '#557659',
        },
        soul: {
          light: '#F9F1F4',
          border: '#9E5870',
          accent: '#9E5870',
          darkBg: '#2A1F24',
          darkBorder: '#D48BA3',
          badge: '#9E5870',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
}
