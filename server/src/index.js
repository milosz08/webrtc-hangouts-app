'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const logger = require('./logger');
const config = require('./config');
const { io, httpServer } = require('./socket');

const { onJoinToRoom } = require('./room/join');
const { onGetRoomParticipants } = require('./room/connection');
const { onLeaveRoom, onDisconnectFromSession } = require('./room/leave');

const PORT = config.PORT;

io.on('connection', socket => {
  // invoke on user join room (determinate host or regular user)
  socket.on('room:join', onJoinToRoom);
  // invoke get all participants from meeting with roomId
  socket.on('room:participants', onGetRoomParticipants);
  // invoke on send signal from user to disconnect from room
  socket.on('room:leave', onLeaveRoom);
  // invoke on disconnected any user from any room (interrupt by closing browser, etc.)
  socket.on('disconnect', onDisconnectFromSession);
});

httpServer.listen(PORT, () => {
  logger.info(`Server started at port: ${PORT}`);
});
