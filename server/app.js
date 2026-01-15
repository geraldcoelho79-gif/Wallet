import express from 'express';
import logger from './utils/logger.js';
import config from './utils/config.js';
import middleware from './utils/middleware.js';
import listsRouter from './controllers/lists.js';
import usersRouter from './controllers/users.js';
import { connectToDatabase } from './utils/db.js';

const app = express();

logger.info('connecting to', config.MONGO_URI)
connectToDatabase();

app.use(express.static('./server/dist'))
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/lists', listsRouter);
app.use('/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export { app };
