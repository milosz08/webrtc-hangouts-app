'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const { PeerServer } = require('peer');
const cors = require('cors');

const expressServer = express();
const httpServer = http.createServer(expressServer);

const io = new Server(httpServer, {
  cors: {
    origin: config.CLIENT_URL,
  },
});

const peerServer = PeerServer({
  debug: true,
  port: config.PEER_PORT,
  path: '/peerjs',
  proxied: true,
  corsOptions: {
    origin: '*',
  },
});

expressServer.use(
  cors({
    origin: config.CLIENT_URL,
    optionsSuccessStatus: 200,
  })
);

expressServer.use(express.json());
expressServer.use(express.urlencoded({ extended: true }));

module.exports = {
  io,
  httpServer,
  expressServer,
  peerServer,
};
