'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
const { rooms } = require('../state');
const logger = require('../logger');
const { io } = require('../socket');

const reasignedRoomHost = (room, participantSocketId) => {
  let reasigned = false;
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
    io.to(room.roomId).emit('room:reasigned-host', {
      message: `Host leave meeting. ${room.host.nickname} are the host now.`,
    });
    reasigned = true;
  }
  return { participant, reasigned };
};

const deleteSelectedRoom = (room, roomKey) => {
  if (room.participants.length === 0) {
    logger.info(
      `No participants in room with id: ${room.roomId}. Deleting room.`
    );
    io.to(room.roomId).emit('room:deleted', {
      message: `Room was deleted.`,
    });
    rooms.delete(roomKey);
    return true;
  }
  return false;
};

module.exports = {
  onLeaveRoom: function ({ roomKey, userSocketId }) {
    const room = rooms.get(roomKey);
    if (room) {
      const { roomId, participants } = room;
      const { participant, reasigned } = reasignedRoomHost(room, userSocketId);
      room.participants = participants.filter(
        ({ socketId }) => socketId !== userSocketId
      );
      const isRoomDeleted = deleteSelectedRoom(room, roomKey);
      if (isRoomDeleted) {
        return;
      }
      if (!reasigned) {
        io.to(roomId).emit('room:participant-leaved', {
          message: `User ${participant.nickname} has leaved the room.`,
        });
      }
      io.to(roomId).emit('room:participants', {
        participants: room.participants,
        host: room.host,
      });
    }
  },
  onDisconnectFromSession: function () {
    let foundClientSocketRoom = null;
    let disconnectedParticipant = null;
    let reasignedHost = false;
    rooms.forEach((room, key) => {
      const reasignedData = reasignedRoomHost(room, this.id);
      if (reasignedData) {
        const { participant, reasigned } = reasignedData;
        foundClientSocketRoom = room;
        disconnectedParticipant = participant;
        reasignedHost = reasigned;
      }
      room.participants = room.participants.filter(
        ({ socketId }) => socketId !== this.id
      );
      deleteSelectedRoom(room, key);
    });
    if (foundClientSocketRoom && disconnectedParticipant) {
      const { roomId, participants, host } = foundClientSocketRoom;
      if (!reasignedHost) {
        io.to(roomId).emit('room:participant-leaved', {
          message: `User ${disconnectedParticipant.nickname} has leaved the room.`,
        });
      }
      io.to(roomId).emit('room:participants', {
        participants,
        host,
        message: `Participant ${disconnectedParticipant} was disconnected`,
      });
    }
  },
};
