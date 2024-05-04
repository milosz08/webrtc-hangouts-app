'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const dotnev = require('dotenv');

dotnev.config();

console.log(process.env);

module.exports = {
  PORT: process.env.NODE_PORT,
  CLIENT_URL: process.env.CLIENT_URL,
};
