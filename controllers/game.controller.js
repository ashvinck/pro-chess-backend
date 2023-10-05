import createError from 'http-errors';
import Game from '../models/game.model.js';

export const saveGameData = async (req, res, next) => {
  try {
    // getting the game data from the req body
    const { id, fen, winner, timeStamp } = req.body;
    const { user } = req;
    const dataExists = await Game.findOne({ id, user });
    if (dataExists) {
      dataExists.fen = fen;
      dataExists.winner = winner;
      dataExists.timeStamp = timeStamp;
      await dataExists.save();
    } else {
      const data = new Game({ id, fen, winner, user, timeStamp });
      await data.save();
    }
    res.status(200).send({ message: 'Game data saved successfully' });
  } catch (error) {
    console.error('Error saving game data: ', error);
    next(error);
  }
};

export const loadGameData = async (req, res, next) => {
  try {
    const { user } = req;
    const gameData = await Game.find({ user });
    if (gameData.length === 0) {
      throw createError.NotFound('User not found');
    }
    res.status(200).json(gameData);
  } catch (error) {
    console.error('Error fetchinh game data: ', error);
    next(error);
  }
};
