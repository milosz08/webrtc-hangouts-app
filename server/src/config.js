'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const dotnev = require('dotenv');

dotnev.config();

module.exports = {
  PORT: process.env.NODE_PORT,
  PEER_PORT: process.env.PEER_PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  STUN_SERVER_DOMAIN: process.env.STUN_SERVER_DOMAIN,
  STUN_SERVER_KEY: process.env.STUN_SERVER_KEY,
  ICE_EXPIRATION_MINUTES: 120,
};
