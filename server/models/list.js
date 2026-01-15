import mongoose from 'mongoose';

// --- Mongoose Schema and Model ---
const listSchema = new mongoose.Schema({
  name: String,
  tickers: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { versionKey: false });

const List = mongoose.model('List', listSchema, 'Lists');

export { List };
