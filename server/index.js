import express from 'express';
import logger from './utils/logger.js';
import config from './utils/config.js';
import middleware from './utils/middleware.js';
import listsRouter from './controllers/lists.js';
import mongoose from 'mongoose';

const app = express();

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGO_URI)
  .then(() => logger.info('MongoDB connected successfully.'))
  .catch(err => logger.error('MongoDB connection error:', err));

app.use(express.static('./server/dist'))
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/lists', listsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server listening on ${config.PORT}`);
});
