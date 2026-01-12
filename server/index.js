import express from 'express';
import { List } from './database.js';
// Useful only for development environment to read .env file
import 'dotenv/config';

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT;

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