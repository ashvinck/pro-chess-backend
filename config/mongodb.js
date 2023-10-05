import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

export async function connectToMongoDB() {
  const MONGO_URL = process.env.MONGO_URL;
  try {
    if (!MONGO_URL) {
      throw createError.BadRequest('MONGO_URL is not defined');
    }
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.log(error);
    throw createError.InternalServerError('Error connecting to MongoDB');
  }
}
