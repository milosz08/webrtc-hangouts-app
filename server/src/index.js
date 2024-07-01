'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const logger = require('./logger');
const config = require('./config');
const { io, httpServer, expressServer } = require('./socket');

const { onJoinToRoom } = require('./room/join');
const { onGetRoomParticipants } = require('./room/connection');
const { onUpdateSessionNickname } = require('./room/nickname');
const {
  onLeaveRoom,
  onDisconnectFromSession,
  onCloseRoom,
} = require('./room/leave');
const { processMessage, fetchMessages, clearChat } = require('./room/chat');
const {
  peerConnectionRequest,
  peerVideoToggle,
  peerAudioToggle,
} = require('./room/peer');

const { handleGetIceServers } = require('./ice/servers');

const PORT = config.PORT;

io.on('connection', socket => {
  // invoke on user join room (determinate host or regular user)
  socket.on('room:join', onJoinToRoom);
  // invoke get all participants from meeting with roomId
  socket.on('room:participants', onGetRoomParticipants);
  // invoke on change participant nickname in active room session
  socket.on('room:change-nickname', onUpdateSessionNickname);
  // invoke on send signal from user to disconnect from room
  socket.on('room:leave', onLeaveRoom);
  // invoke on disconnected any user from any room (interrupt by closing browser, etc.)
  socket.on('disconnect', onDisconnectFromSession);
  // invoke on close session by host or end time and destroy room
  socket.on('room:close', onCloseRoom);
  // process message from room's chat
  socket.on('chat:mess-send', processMessage);
  // fetch messages from selected room
  socket.on('chat:mess-fetch', fetchMessages);
  // clear chat messages from selected room
  socket.on('chat:clear', clearChat);
  // peer connection request (web-rtc)
  socket.on('peer:connection-request', peerConnectionRequest);
  // user disable video (web-rtc)
  socket.on('peer:video-toggle', peerVideoToggle);
  // user disable audio (web-rtc)
  socket.on('peer:audio-toggle', peerAudioToggle);
});

expressServer.get('/api/v1/ice', handleGetIceServers);

httpServer.listen(PORT, () => {
  logger.info(`Server started at port: ${PORT}`);
});
