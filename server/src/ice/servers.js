'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const config = require('../config');
const axios = require('axios');
const logger = require('../logger');

module.exports = {
  handleGetIceServers: async ({ res }) => {
    let iceServers = [];
    try {
      const { data: servers } = await axios.get(
        `https://${config.STUN_SERVER_DOMAIN}/api/v1/turn/credentials?apiKey=${config.STUN_SERVER_KEY}`
      );
      iceServers = servers;
    } catch (error) {
      logger.error(`Unable to fetch ICE servers. Cause: ${error.message}`);
    }
    res.json(iceServers);
  },
};
