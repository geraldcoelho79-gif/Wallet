import mongoose from 'mongoose';
import logger from './logger.js';
import config from './config.js';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info('MongoDB connected successfully.');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export { connectToDatabase };