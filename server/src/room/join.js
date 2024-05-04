'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const { rooms } = require('../state');
const logger = require('../logger');
const { io } = require('../socket');
const { v4: uuidv4 } = require('uuid');

const createNewRoomAndJoinHost = (socket, roomId, nickname, code) => {
  const participant = { nickname, socketId: socket.id };
  rooms.set(code, {
    roomId,
    host: participant,
    participants: [participant],
  });
  socket.join(roomId);
  logger.info(`Created new room with ID: ${roomId} and host: ${nickname}`);
};

const joinToExistingRoom = (socket, room, nickname) => {
  const nicknameExisting = room.participants.find(
    user => user.nickname === nickname
  );
  // check, if user with provided nickname already exist
  if (nicknameExisting) {
    logger.warn(
      `Attemt to join user with existing nickname: ${nickname} to room with ID: ${room.roomId}`
    );
    io.to(socket.id).emit('room:join-failed', {
      reason: 'Nickname is already been used. Change nickname!',
    });
    return false;
  }
  socket.join(room.roomId);
  room.participants = [...room.participants, { nickname, socketId: socket.id }];
  logger.info(
    `Join new user with nickname: ${nickname} to room with ID: ${room.roomId}`
  );
  io.to(room.roomId).emit('room:participant-joined', {
    message: `User ${nickname} has joined to the room.`,
  });
  return true;
};

module.exports = {
  onJoinToRoom: function ({ nickname, code }) {
    const existingRoom = rooms.get(code);
    let isHost = false;
    let roomId = uuidv4();
    // room not yet existing, set host
    if (!existingRoom) {
      createNewRoomAndJoinHost(this, roomId, nickname, code);
      isHost = true;
    } else {
      const isOk = joinToExistingRoom(this, existingRoom, nickname);
      if (!isOk) {
        return;
      }
      roomId = existingRoom.roomId;
    }
    io.to(this.id).emit('room:join-succeed', {
      isHost,
      meetingId: roomId,
      meetingKey: code,
    });
  },
};
