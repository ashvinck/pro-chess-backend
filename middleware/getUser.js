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
    // Splitting the auth header for user details
    const userDetails = authHeader.split(' ');
    // Retrieve the user email
    const userEmail = userDetails[1];
    // Retrieve the userName
    // passing userEmail information to the request
    req.userEmail = userEmail;
    next();
  } catch (error) {
    console.error('Error getting user info', error);
    throw createError.Unauthorized();
  }
};
