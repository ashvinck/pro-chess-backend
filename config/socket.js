import createError from 'http-errors';
import { GameEventEnum } from '../constants.js';
import { getSocketUser } from '../middleware/getSocketUser.js';
import {
  mountCreateRoomEvent,
  mountOnCloseRoomEvent,
  mountOnMessageReceivedEvent,
  mountOnMoveEvent,
  mountOnPlayerLeftEvent,
  mountOnStartGameEvent,
  mountOpponentJoinedRoomEvent,
} from '../controllers/mulitplayer.controller.js';

// // Initialization of Socket.io logic
const initializeSocketIO = (io) => {
  // authentication of the user
  io.use(getSocketUser);

  return io.on('connection', async (socket) => {
    try {
      // ------ If connected emitted to client -----
      console.log(socket.id, 'connected');
      socket.emit(GameEventEnum.CONNECTED_EVENT, {
        message: 'You are now connected!',
      });

      // ----- if User creates a new room -----
      mountCreateRoomEvent(socket);
      mountOpponentJoinedRoomEvent(socket);
      mountOnStartGameEvent(socket);
      mountOnMoveEvent(socket);
      mountOnMessageReceivedEvent(socket);
      mountOnPlayerLeftEvent(socket);
      mountOnCloseRoomEvent(io, socket);
    } catch (error) {
      console.error('Error', error.message);
      socket.emit('error', { message: 'Internal Server Error' });
      throw createError.InternalServerError(error.message);
    }
  });
};

export { initializeSocketIO };
