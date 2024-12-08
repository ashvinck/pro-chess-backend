/**
 * Getting the user from the client for authentication
 * **/
export const getSocketUser = (socket, next) => {
  try {
    const user = socket.handshake.auth;
    if (!user) throw createError.Unauthorized();

    // console.log('user', user);

    socket.user = user;

    next();
  } catch (error) {
    console.error('Error getting user info', error);
    throw createError.InternalServerError();
  }
};
