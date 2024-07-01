'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const { rooms } = require('../state');
const logger = require('../logger');
const { io } = require('../socket');

const checkRoomAndResponse = ({
  roomKey,
  onChange,
  userPeerId,
  logMessage,
  outputSignal,
  data,
}) => {
  const existingRoom = rooms.get(roomKey);
  if (existingRoom) {
    const participant = existingRoom.participants.find(
      ({ peerId }) => peerId === userPeerId
    );
    if (!participant) {
      return;
    }
    onChange(participant);
    logger.info(logMessage, ` Room id: ${existingRoom}`);
    io.to(existingRoom.roomId).emit(outputSignal, data(participant.nickname));
  }
};

module.exports = {
  peerConnectionRequest: function ({ roomKey, peerId }) {
    checkRoomAndResponse({
      roomKey,
      onChange: () => {},
      userPeerId: peerId,
      logMessage: `New user with peer ID: ${peerId} connected`,
      outputSignal: 'peer:connection-accepted',
      data: () => ({ peerId }),
    });
  },
  peerVideoToggle: function ({ roomKey, peerId, state }) {
    checkRoomAndResponse({
      roomKey,
      onChange: participant => (participant.isVideoOn = state),
      userPeerId: peerId,
      logMessage: `User with peer ID: ${peerId} toggle video state: ${state}`,
      outputSignal: 'peer:video-toggle-response',
      data: nickname => ({
        peerId,
        state,
        message: `User ${nickname} has ${state ? 'enabled' : 'disabled'} video`,
      }),
    });
  },
  peerAudioToggle: function ({ roomKey, peerId, state }) {
    checkRoomAndResponse({
      roomKey,
      onChange: participant => (participant.isAudioOn = state),
      userPeerId: peerId,
      logMessage: `User with peer ID: ${peerId} toggle audio state: ${state}`,
      outputSignal: 'peer:audio-toggle-response',
      data: nickname => ({
        peerId,
        state,
        message: `User ${nickname} has ${state ? 'enabled' : 'disabled'} audio`,
      }),
    });
  },
};
