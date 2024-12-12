import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { rateLimit } from 'express-rate-limit';
import createHttpError from 'http-errors';
import { config } from 'dotenv';
import cors from 'cors';
import { connectToMongoDB } from './config/mongodb.js';
import singlePlayerRouter from './routes/game.routes.js';
import { initializeSocketIO } from './config/socket.js';
config();

// Initializing express App
const app = express();

app.use(helmet());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set('io', io); // using set method to mount the `io` instance on the app to avoid usage of `global`

// global middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_, __, ___, options) => {
    throw createHttpError(
      options.statusCode || 500,
      `Too many requests. Only ${options.limit} requests allowed per ${
        options.windowMs / 60000
      } minutes`
    );
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use('/play/computer', singlePlayerRouter);

initializeSocketIO(io);

app.get('/', function (request, response) {
  response.status(200).send('🙋‍♂️, Hello! welcome to Pro Chess Backend!');
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

// Start Server
const startServer = () => {
  httpServer.listen(process.env.PORT || 8080, () => {
    console.log('The server started in: ' + process.env.PORT + '😁✨');
  });
};
connectToMongoDB()
  .then(() => startServer())
  .catch((err) => {
    console.error('Mongodb connection error: ', err);
  });
