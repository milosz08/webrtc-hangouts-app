'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const { rooms } = require('../state');
const { io } = require('../socket');
const logger = require('../logger');

const sendErrorResponse = (message, socketId) => {
  io.to(socketId).emit('user:failed-update-nickname', {
    reason: message,
  });
};

module.exports = {
  onUpdateSessionNickname: function ({ newNickname, roomKey }) {
    const room = rooms.get(roomKey);
    // check if room exist and if has any participants
    if (!room || room.participants.length === 0) {
      sendErrorResponse('Passed room not exist.', this.id);
      return;
    }
    const { participants } = room;
    const nicknames = participants.map(({ nickname }) => nickname);
    // check if any participant with nickname already existing
    if (nicknames.some(existingNickname => newNickname === existingNickname)) {
      sendErrorResponse(
        `User with nickname ${newNickname} already exist in this room.`,
        this.id
      );
      return;
    }
    const participantIndex = participants.findIndex(
      ({ socketId }) => socketId === this.id
    );
    // check, if user existing in participants
    if (participantIndex === -1) {
      sendErrorResponse(`Unexpected error.`, this.id);
      return;
    }
    const prevNickname = participants[participantIndex].nickname;
    participants[participantIndex].nickname = newNickname;
    logger.info(
      `Updated user nickname from: ${prevNickname} to ${newNickname} in room with ID: ${room.roomId}`
    );
    // emit to all participants in room
    io.to(room.roomId).emit('room:update-nickname', {
      updatedNickname: newNickname,
      userSocketId: this.id,
      message: `User ${prevNickname} changed nickname to ${newNickname}.`,
    });
    // emit only for user whom changing nickname
    io.to(this.id).emit('user:update-nickname', {
      updatedNickname: newNickname,
    });
  },
};
