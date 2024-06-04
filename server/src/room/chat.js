'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const { rooms, messages } = require('../state');
const logger = require('../logger');
const { io } = require('../socket');

const sendFailedMessage = (userSocketId, message) => {
  io.to(userSocketId).emit('chat:mess-failed', {
    message,
  });
};

const checkIfUserBelongToRoom = (roomKey, userSocketId) => {
  const room = rooms.get(roomKey);
  if (!room) {
    logger.error(`Room with key: ${roomKey} not exist.`);
    return {
      reason: 'Room with following ID not exist!',
      room: null,
      participant: null,
    };
  }
  const participant = room.participants.find(
    ({ socketId }) => socketId === userSocketId
  );
  if (!participant) {
    logger.error(`User not belong to room with ID: ${room.roomId}`);
    return {
      reason: 'You are not belong to this chat room!!',
      room,
      participant: null,
    };
  }
  return { reason: '', room, participant };
};

module.exports = {
  fetchMessages({ roomKey }) {
    const { room, reason } = checkIfUserBelongToRoom(roomKey, this.id);
    if (reason) {
      sendFailedMessage(reason);
      return;
    }
    const roomMessages = messages.get(room.roomId);
    io.to(this.id).emit('chat:fetch-recv', {
      messages: roomMessages || [],
    });
  },
  processMessage({ roomKey, message }) {
    const { room, participant, reason } = checkIfUserBelongToRoom(
      roomKey,
      this.id
    );
    if (reason) {
      sendFailedMessage(reason);
      return;
    }
    const roomMessages = messages.get(room.roomId);
    const newMessage = {
      userSocket: this.id,
      userNickname: participant.nickname,
      message,
    };
    messages.set(room.roomId, [...roomMessages, newMessage]);
    const allMessages = roomMessages.length + 1;
    logger.info(
      `User: ${participant.nickname} send message to room: ${room.roomId}. All: ${allMessages}. Message: ${message}`
    );
    io.to(room.roomId).emit('chat:mess-recv', newMessage);
  },
  clearChat({ roomKey }) {
    const room = rooms.get(roomKey);
    if (!room) {
      logger.error(`Room with key: ${roomKey} not exist.`);
      sendFailedMessage('Room with following ID not exist!');
      return;
    }
    const isRoomOwner = room.host.socketId === this.id;
    if (!isRoomOwner) {
      logger.error(`You are not owner of room ${roomKey}.`);
      sendFailedMessage('You are not owner of this room!');
      return;
    }
    const messagesSize = messages.get(room.roomId);
    messages.set(room.roomId, []);
    logger.info(
      `Chat for room: ${room.roomId} was successfully cleared. Deleted ${messagesSize.length} messages.`
    );
    io.to(room.roomId).emit('chat:clear-res', {
      message: 'Chat was cleared by host',
    });
  },
};
