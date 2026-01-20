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
  passwordHash: {
    type: String,
    required: true
  },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List'
    }
  ]
}, { versionKey: false, strict: 'throw' });

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

const User = mongoose.model('User', userSchema, 'Users');

export { User };
