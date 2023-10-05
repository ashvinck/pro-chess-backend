import createError from 'http-errors';

/**
 * Getting the user from the client and adding it to the request object
 * **/
export const getUser = (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError.Unauthorized();
    }
    const user = authHeader.split(' ')[1];
    req.user = user;
    next();
  } catch (error) {
    console.error('Error getting user info', error);
    throw createError.Unauthorized();
  }
};
