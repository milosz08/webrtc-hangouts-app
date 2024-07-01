'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const { rooms, messages, timers } = require('../state');
const logger = require('../logger');
const { io } = require('../socket');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const Timer = require('tm-timer');

const onTimerTick = (isBigTick, ms, roomId) => {
  if (isBigTick) {
    io.to(roomId).emit('room:timer-tick', {
      elapsedTime: ms / 1000,
    });
  }
};

const onTimerEnd = roomId => {
  io.to(roomId).emit('room:time-elapsed', {
    message: 'Session ended',
  });
};

const createNewRoomAndJoinHost = (
  socket,
  roomId,
  nickname,
  code,
  peerId,
  isVideoOn,
  isAudioOn
) => {
  const participant = {
    nickname,
    socketId: socket.id,
    peerId,
    isVideoOn,
    isAudioOn,
  };
  rooms.set(code, {
    roomId,
    host: participant,
    participants: [participant],
  });
  messages.set(roomId, []);

  const timer = new Timer();
  timer.set(config.ICE_EXPIRATION_MINUTES * 60 * 1000);
  timer.whenDone(() => onTimerEnd(roomId));
  timer.onTick((isBigTick, timeLeft) =>
    onTimerTick(isBigTick, timeLeft, roomId)
  );
  timers.set(roomId, timer);
  timer.start();

  socket.join(roomId);
  logger.info(`Created new room with ID: ${roomId} and host: ${nickname}`);
};

const joinToExistingRoom = (
  socket,
  room,
  nickname,
  peerId,
  isVideoOn,
  isAudioOn
) => {
  const nicknameExisting = room.participants.find(
    user => user.nickname === nickname
  );
  // check, if user with provided nickname already exist
  if (nicknameExisting) {
    logger.warn(
      `Attempt to join user with existing nickname: ${nickname} to room with ID: ${room.roomId}`
    );
    io.to(socket.id).emit('room:join-failed', {
      reason: 'Nickname is already been used. Change nickname!',
    });
    return false;
  }
  socket.join(room.roomId);
  room.participants = [
    ...room.participants,
    { nickname, socketId: socket.id, peerId, isVideoOn, isAudioOn },
  ];
  logger.info(
    `Join new user with nickname: ${nickname} to room with ID: ${room.roomId}`
  );
  io.to(room.roomId).emit('room:participant-joined', {
    message: `User ${nickname} has joined to the room.`,
    peerId,
    socketId: socket.id,
    nickname,
    isVideoOn,
    isAudioOn,
    elapsedTime: room.elapsedTime,
  });
  return true;
};

module.exports = {
  onJoinToRoom: function ({ nickname, code, peerId, isVideoOn, isAudioOn }) {
    const existingRoom = rooms.get(code);
    let isHost = false;
    let roomId = uuidv4();
    // room not yet existing, set host
    if (!existingRoom) {
      createNewRoomAndJoinHost(
        this,
        roomId,
        nickname,
        code,
        peerId,
        isVideoOn,
        isAudioOn
      );
      isHost = true;
    } else {
      const isOk = joinToExistingRoom(
        this,
        existingRoom,
        nickname,
        peerId,
        isVideoOn,
        isAudioOn
      );
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
