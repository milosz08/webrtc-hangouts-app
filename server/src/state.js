'use strict';
/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */

// holding all rooms info as [roomId->data]
const rooms = new Map();

// holding all messages from chats
const messages = new Map();

// holding all timers from open rooms
const timers = new Map();

module.exports = {
  rooms,
  messages,
  timers,
};
