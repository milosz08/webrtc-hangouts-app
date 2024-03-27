'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */

module.exports = {
  tabWidth: 2,
  printWidth: 80,
  useTabs: false,
  singleQuote: true,
  semi: true,
  bracketSpacing: true,
  arrowParens: "avoid",
  trailingComma: "es5",
  bracketSameLine: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^(react*)$",
    "^(@.*)$",
    "^([a-zA-Z].*)$",
    "^~/(.*)$",
    "^[./]",
    "^[../]",
    "^~/(-styles)$",
    "^~/(.styles)$",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};

