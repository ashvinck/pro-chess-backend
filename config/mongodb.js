import mongoose from 'mongoose';
import { config } from 'dotenv';
import createError from 'http-errors';
config();

export async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.log(error);
    throw createError.InternalServerError('Error connecting to MongoDB');
  }
}
