/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * Foundation: matte black + ivory. Gold/bronze are controlled
         * accents, not a wash -- the African identity should read through
         * photography, pattern and typography, not saturated color.
         */
        ink: {
          950: '#0d0d0c',
          900: '#151513',
          800: '#201f1c',
          700: '#332f29',
        },
        ivory: {
          50: '#fbf9f4',
          100: '#f6f2e9',
          200: '#ede5d3',
        },
        gold: {
          200: '#e6cf9c',
          300: '#d4b46e',
          400: '#c19a4b',
          500: '#a5813c',
        },
        bronze: {
          400: '#a56a43',
          500: '#8a5636',
          600: '#6e4429',
        },
        /* Supporting palette -- used sparingly, one at a time, for a
           collection accent or a textile section, never combined. */
        forest: '#243527',
        terracotta: '#b8562f',
        burgundy: '#5c1f2a',
        chocolate: '#3b2a20',
        sand: '#cbb994',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
        widest3: '0.4em',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
