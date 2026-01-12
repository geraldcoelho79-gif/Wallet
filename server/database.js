import mongoose from 'mongoose';
import 'dotenv/config';

// --- MongoDB Connection ---
// eslint-disable-next-line no-undef
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema and Model ---
const listSchema = new mongoose.Schema({
  tickers: [String]
});

const List = mongoose.model('List', listSchema, 'Lists');

export { List };
