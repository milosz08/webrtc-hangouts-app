'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');

const expressServer = express();
const httpServer = http.createServer(expressServer);

const io = new Server(httpServer, {
  cors: {
    origin: config.CLIENT_URL,
  },
});

module.exports = {
  io,
  httpServer,
};
