import mongoose from 'mongoose';

// --- Mongoose Schema and Model ---
const listSchema = new mongoose.Schema({
  tickers: [String]
}, { versionKey: false });

const List = mongoose.model('List', listSchema, 'Lists');

export { List };
