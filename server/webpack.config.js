'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const dotenv = require('dotenv');
const path = require('path');
const { DefinePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const TerserWebpackPlugin = require('terser-webpack-plugin');

dotenv.config();

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'node',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  stats: {
    warnings: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    clean: isProduction(),
    publicPath: '/',
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
  plugins: [
    { plugin: new RemoveEmptyScriptsPlugin() },
    { prod: false, plugin: new NodemonPlugin() },
    {
      plugin: new DefinePlugin({
        'process.env.SERVER_PORT': JSON.stringify(process.env.NODE_PORT || 80),
        'process.env.CLIENT_URL': JSON.stringify(
          process.env[`CLIENT_${isProduction() ? 'PROD' : 'DEV'}_URL`]
        ),
      }),
    },
  ]
    .filter(details => (isProduction() ? details.prod : true))
    .map(({ plugin }) => plugin),
  optimization: {
    minimize: isProduction(),
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          mangle: true,
          compress: true,
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
