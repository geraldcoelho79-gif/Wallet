import express from 'express';
import mongoose from 'mongoose';
// Useful only for development environment to read .env file
import 'dotenv/config';

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;

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

app.use(express.static('./server/dist'))

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// An api endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server !!" });
});

// --- New endpoint to get all lists ---
app.get("/lists", async (req, res) => {
  try {
    console.log("entering endpoint")
    const lists = await List.find();
    console.log(lists);
    res.json(lists);
  } catch (err) {
    console.error("Error fetching lists:", err);
    res.status(500).json({ message: "Server error while fetching lists" });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});