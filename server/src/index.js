'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const express = require('express');
const http = require('http');
const io = require('socket.io');
const config = require('./config');
const logger = require('./logger');

const PORT = config.PORT;

const expressServer = express();
const httpServer = http.createServer(expressServer);
const ioServer = io(httpServer);

ioServer.on('connection', () => {
  console.log('connected with socket.io');
});

expressServer.use('/api/v1/ping', (req, res) => {
  return res.status(200).json({ message: 'PONG PONG' });
});

httpServer.listen(PORT, () => {
  logger.info(`Server started at port: ${PORT}`);
});
