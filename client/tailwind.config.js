'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import flowbite from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    '../node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite],
  darkMode: 'class',
};
