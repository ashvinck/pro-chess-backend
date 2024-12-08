/**
 * @description set of events that we are using in our app.
 */
export const GameEventEnum = Object.freeze({
  CONNECTED_EVENT: 'connected',
  DISCONNECT_EVENT: 'disconnected',
  CREATE_ROOM_EVENT: 'createRoom',
  OPPONENT_JOINED_EVENT: 'joinRoom',
  GAME_START_EVENT: 'gameStart',
  MOVE_EVENT: 'move',
  MESSAGE_EVENT: 'message',
  PLAYER_DISCONNECTED_EVENT: 'playerDisconnected',
  CLOSE_ROOM_EVENT: 'closeRoom',
  SOCKET_ERROR_EVENT: 'socketError',
});

export const AvailableChatEvents = Object.values(GameEventEnum);
