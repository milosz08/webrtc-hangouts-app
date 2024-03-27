'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
  },
};
