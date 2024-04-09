'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import flowbite from 'flowbite/plugin';
import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    '../node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#BFDCE6',
        'custom-purple': '#C6C1D6',
        'dark-blue': '#0D2238',
        'dark-purple': '#241B36',
        'dark-bg': '#0A1C2B',
        'dark-textarea': '#1A314E',
        'dark-purple-nav': '#382a54',
        'dark-border': '#222e3b',
        'dark-dropdown': '#293847',
        'dark-pininput': '#3f315c',
        'dark-meeting': '#1f194a',
        'custom-meeting': '#dedfdf',
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        gradient: 'gradient 15s ease infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
    },
  },
  variants: {
    extend: {
      width: ['group-hover'],
    },
  },
  plugins: [flowbite, tailwindScrollbar],
  darkMode: 'class',
};
