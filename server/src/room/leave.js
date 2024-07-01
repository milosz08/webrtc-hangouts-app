'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const { rooms, messages, timers } = require('../state');
const logger = require('../logger');
const { io } = require('../socket');

const reassignedRoomHost = (room, participantSocketId) => {
  let reassigned = false;
  const participant = room.participants.find(
    ({ socketId }) => socketId === participantSocketId
  );
  if (!participant) {
    return null;
  }
  const restOfParticipants = room.participants.filter(
    ({ socketId }) => socketId !== participantSocketId
  );
  if (
    participant.socketId === room.host.socketId &&
    restOfParticipants.length > 0
  ) {
    const previousHost = room.host;
    room.host = restOfParticipants[0];
    logger.info(
      `Change room host from ${previousHost.nickname} to ${room.host.nickname}.`
    );
    reassigned = true;
  }
  return { participant, reassigned };
};

const deleteSelectedRoom = (room, roomKey) => {
  if (room.participants.length === 0) {
    const timer = timers.get(room.roomId);
    if (timer) {
      timer.stop();
      timer.reset();
      timers.delete(room.roomId);
    }
    logger.info(
      `No participants in room with id: ${room.roomId}. Deleting room.`
    );
    io.to(room.roomId).emit('room:deleted', {
      message: `Room was deleted.`,
    });
    rooms.delete(roomKey);
    messages.delete(room.roomId);
    return true;
  }
  return false;
};

module.exports = {
  onLeaveRoom: function ({ roomKey, userSocketId }) {
    const room = rooms.get(roomKey);
    if (room) {
      const { roomId, participants } = room;
      const reassignedRoomHostData = reassignedRoomHost(room, userSocketId);
      if (!reassignedRoomHostData) {
        return;
      }
      const { participant, reassigned } = reassignedRoomHostData;
      room.participants = participants.filter(
        ({ socketId }) => socketId !== userSocketId
      );
      const isRoomDeleted = deleteSelectedRoom(room, roomKey);
      if (isRoomDeleted) {
        return;
      }
      io.to(roomId).emit('room:participant-leaved', {
        message: reassigned
          ? `Host leave meeting. ${room.host.nickname} are the host now.`
          : `User ${participant.nickname} has leaved the room.`,
        participant,
        reassigned,
        newHost: room.host,
      });
    }
  },
  onDisconnectFromSession: function () {
    let foundClientSocketRoom = null;
    let disconnectedParticipant = null;
    let reassignedHost = false;
    rooms.forEach((room, key) => {
      const reassignedData = reassignedRoomHost(room, this.id);
      if (reassignedData) {
        const { participant, reassigned } = reassignedData;
        foundClientSocketRoom = room;
        disconnectedParticipant = participant;
        reassignedHost = reassigned;
      }
      room.participants = room.participants.filter(
        ({ socketId }) => socketId !== this.id
      );
      deleteSelectedRoom(room, key);
    });
    if (foundClientSocketRoom && disconnectedParticipant) {
      const { roomId, host } = foundClientSocketRoom;
      io.to(roomId).emit('room:participant-leaved', {
        message: reassignedHost
          ? `Host leave meeting. ${host.nickname} are the host now.`
          : `User ${disconnectedParticipant.nickname} has leaved the room.`,
        participant: disconnectedParticipant,
        reassigned: reassignedHost,
        newHost: host,
      });
    }
  },
  onCloseRoom: function ({ roomKey, invokeBy }) {
    const room = rooms.get(roomKey);
    if (room) {
      rooms.delete(roomKey);
      messages.delete(room.roomId);
      logger.info(
        `Successfully deleted room: ${room.roomId}. Invoked by: ${invokeBy}`
      );
      io.to(room.roomId).emit('room:deleted', {
        message: `Session ended.`,
      });
    }
  },
};
