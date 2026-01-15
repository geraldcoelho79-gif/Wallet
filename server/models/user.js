import mongoose from 'mongoose';

// --- Mongoose Schema and Model ---
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3
  },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List'
    }
  ]
}, { versionKey: false });

const User = mongoose.model('User', userSchema, 'Users');

export { User };
