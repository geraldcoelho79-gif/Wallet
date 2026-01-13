import express from 'express';
import { List } from './database.js';
// Useful only for development environment to read .env file
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static('./server/dist'))

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// An api endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server !!' });
});

// --- New endpoint to get all lists ---
app.get('/lists', async (req, res, next) => {
  try {
    console.log('entering endpoint')
    const lists = await List.find();
    console.log(lists);
    res.json(lists);
  } catch (err) {
    next(err);
  }
});

// --- New endpoint to add a ticker to a list ---
app.post('/lists/:id/tickers', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ticker } = req.body;

    if (!ticker) {
      return res.status(400).json({ message: 'Ticker is required' });
    }

    const list = await List.findById(id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    list.tickers.push(ticker);
    await list.save();
    console.log(list);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// Middleware for non-existent endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint unknown' });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error fetching:', err);
  res.status(500).json({ message: 'Server error' });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});