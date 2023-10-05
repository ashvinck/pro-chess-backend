import mongoose, { Schema } from 'mongoose';

const gameDataSchema = new Schema({
  id: String,
  fen: String,
  winner: String,
  user: String,
  timeStamp: Date,
});

const Game = mongoose.model('Game', gameDataSchema);

export default Game;
