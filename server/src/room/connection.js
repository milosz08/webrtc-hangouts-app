'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const { rooms } = require('../state');
const logger = require('../logger');
const { io } = require('../socket');

module.exports = {
  onGetRoomParticipants: function ({ roomKey }) {
    const room = rooms.get(roomKey);
    if (room) {
      logger.info(
        `Return room meeting participants. Room id: ${room.roomId} with count: ${room.participants.length}.`
      );
      io.to(room.roomId).emit('room:participants', {
        participants: room.participants,
        host: room.host,
      });
    }
  },
};
