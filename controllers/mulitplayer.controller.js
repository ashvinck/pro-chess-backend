import createError from 'http-errors';
import { GameEventEnum } from '../constants.js';
import { v4 as uuidV4 } from 'uuid';

// Create a Map to store information about active game rooms
const rooms = new Map();

// Event handler for when a user wants to create a game room
const mountCreateRoomEvent = (socket) => {
  socket.on(GameEventEnum.CREATE_ROOM_EVENT, async (callback) => {
    try {
      // Generate a unique room ID using UUIDv4
      const roomId = uuidV4();

      // Make the user join the newly created room
      await socket.join(roomId);

      const { displayName, userPic } = socket?.user;
      // console.log('Inside createRoom', displayName, userPic);

      // Create a new room object with the user as the first player
      const newRoom = {
        roomId,
        players: [
          { id: socket?.id, displayName: displayName, userPic: userPic },
        ],
      };

      // Store the room information in the Map
      rooms.set(roomId, newRoom);
      // console.log('socketid', socket.id);
      // console.log('ROOMS', rooms);

      // // Set the user property on the socket
      // socket.user = newRoom.players[0];

      // Respond to the client with the newly created room ID
      callback({ roomId, displayName, userPic });
    } catch (error) {
      console.error('Error in createRoomEvent : ', error.message);
      throw createError.InternalServerError(error.message);
    }
  });
};

// // Helper function to make a user join a specific game room
const mountOpponentJoinedRoomEvent = async (socket) => {
  socket.on(GameEventEnum.OPPONENT_JOINED_EVENT, async (roomData, callback) => {
    try {
      const { displayName, userPic } = socket?.user;
      const roomId = roomData?.roomId;

      const newPlayer = {
        id: socket?.id,
        displayName: displayName,
        userPic: userPic,
      };

      const room = rooms.get(roomId);
      // console.log('ROOM when opponent is joining.', room);

      if (!room) {
        console.error('Room is empty');
        return callback({ error: 'Room is empty.' });
      }

      if (room.players.length >= 2) {
        console.error('Room is full');
        return callback({ error: 'Room is full.' });
      }
      if (room.players.length === 1) {
        // console.log('Pushing player2');
        room.players.push(newPlayer);
        // console.log('ROOM when opponent is joined.', room);
        await socket.join(roomId);
      }

      // Emit an event to all sockets in the room except the current socket, indicating that an opponent has joined
      socket.to(roomId).emit(GameEventEnum.OPPONENT_JOINED_EVENT, newPlayer);
      callback({ displayName, userPic, roomId });
    } catch (error) {
      console.error('Error in mountOpponentJoinedEvent:', error.message);
    }
  });
};
// const mountOpponentJoinedRoomEvent = async (socket) => {
//   socket.on(GameEventEnum.OPPONENT_JOINED_EVENT, async (callback) => {
//     try {
//       const { displayName, userPic } = socket?.user;
//       const roomId = callback?.roomId;
//       const newPlayer = {
//         id: socket?.id,
//         displayName: displayName,
//         userPic: userPic,
//       };

//       const room = rooms.get(roomId);

//       // Handle the case where the room does not exist (if applicable)
//       if (!room) {
//         console.error('Room does not exist');
//         callback({ error: 'Room does not exist' });
//         return;
//       }

//       // Handle room full condition (max 2 players allowed)
//       if (room.players.length >= 2) {
//         console.error('Room is full');
//         callback({ error: 'Room is full' });
//         return; // Stop further processing
//       }

//       // Handle the case where the room is empty (no players yet)
//       if (room.players.length === 0) {
//         console.error('Room is empty');
//         callback({
//           error:
//             'Room is empty. Cannot join until at least one player is present.',
//         });
//         return; // Stop further processing
//       }

//       // Handle the case where there is one player in the room (waiting for the second player)
//       if (room.players.length === 1) {
//         console.log('Room has one player, adding the second player');
//         room.players.push(newPlayer);
//       }

//       console.log('ROOMs', rooms);

//       // Emit the current state of the game to all users in the room
//       await socket.join(roomId);

//       // Notify all other players (except the current socket) that a new opponent has joined
//       socket.to(roomId).emit(GameEventEnum.OPPONENT_JOINED_EVENT, newPlayer);

//       // Callback to confirm the player has joined
//       callback({ displayName, userPic, roomId });
//     } catch (error) {
//       console.error('Error in mountOpponentJoinedEvent:', error.message);
//       // callback({ error: 'An error occurred while processing your request.' });
//     }
//   });
// };

/// Helper function to determine after the start button is clicked

const mountOnStartGameEvent = async (socket) => {
  socket.on(GameEventEnum.GAME_START_EVENT, (roomId) => {
    try {
      // console.log('roomId', roomId);
      const data = {
        roomId: roomId,
        command: 'start-game',
      };
      socket.to(roomId).emit(GameEventEnum.GAME_START_EVENT, data);
    } catch (error) {
      console.error('Error in mountOnStartGameEvent:', error.message);
    }
  });
};

const mountOnMoveEvent = async (socket) => {
  socket.on(GameEventEnum.MOVE_EVENT, (data) => {
    // console.log('data', data);
    const roomId = data.roomId;
    try {
      socket.to(roomId).emit(GameEventEnum.MOVE_EVENT, data);
      // console.log('This is executed successfully!');
    } catch (error) {
      console.error('Error in mountOnMoveEvent:', error.message);
    }
  });
};

const mountOnMessageReceivedEvent = async (socket) => {
  socket.on(GameEventEnum.MESSAGE_EVENT, (data) => {
    // console.log('data', data);
    const roomId = data.roomId;
    try {
      socket.to(roomId).emit(GameEventEnum.MESSAGE_EVENT, data.message);
    } catch (error) {
      console.error('Error in mountOnMessageReceivedEvent', error.message);
    }
  });
};

const mountOnPlayerLeftEvent = async (socket) => {
  socket.on(GameEventEnum.DISCONNECT_EVENT, (roomId) => {
    try {
      const gameRooms = Array.from(rooms.values());
      gameRooms.forEach((room) => {
        const userInRoom = room.roomId === roomId;
        // console.log('userInRoom', userInRoom);
        if (userInRoom) {
          // console.log('This is called in 136');
          if (room.players.length < 2) {
            // If there's only one player left in the room, delete the room
            rooms.delete(room.roomId);
          }
          // console.log('rooms123', rooms);
          // Notify the remaining player in the room that a player has disconnected
          // console.log('Emitted player left event!');
          socket
            .to(room.roomId)
            .emit(GameEventEnum.PLAYER_DISCONNECTED_EVENT, userInRoom);
        }
      });
    } catch (error) {
      console.error('Error in disconnect event:', error.message);
    }
  });
};

// Event handler for when a user wants to close a game room
const mountOnCloseRoomEvent = async (io, socket) => {
  socket.on(GameEventEnum.CLOSE_ROOM_EVENT, async (data) => {
    try {
      // Notify all sockets in the room that the room is closing
      socket.to(data.roomId).emit(GameEventEnum.CLOSE_ROOM_EVENT, data);

      // Fetch all sockets in the specified room
      const clientSockets = await io.in(data.roomId).fetchSockets();

      // Make each socket in the room leave the room
      clientSockets.forEach((s) => {
        s.leave(data.roomId);
      });

      // Delete the room information from the Map
      rooms.delete(data.roomId);
    } catch (error) {
      console.error('Error in CLOSE_ROOM_EVENT:', error.message);
    }
  });
};

export {
  mountCreateRoomEvent,
  mountOpponentJoinedRoomEvent,
  mountOnStartGameEvent,
  mountOnMoveEvent,
  mountOnMessageReceivedEvent,
  mountOnPlayerLeftEvent,
  mountOnCloseRoomEvent,
};
