import express from 'express';
import createHttpError from 'http-errors';
import { config } from 'dotenv';
import cors from 'cors';
import { connectToMongoDB } from './config/mongodb.js';
import singlePlayerRouter from './routes/game.routes.js';

config();

connectToMongoDB().catch((err) => console.log(err));

// Initializing express App
const app = express();
app.use(express.json());
app.use(cors());

app.use('/play/computer', singlePlayerRouter);

app.get('/', function (request, response) {
  response.status(200).send('🙋‍♂️, Hello welcome to Pro Chess Backend!');
});

// 404 error handling
app.use((req, res, next) => {
  next(new createHttpError.NotFound());
});
// Error Handler (middleware)
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
};
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`The server started in: ${PORT} 😁✨`));
