import express from 'express';
import { List } from '../models/list.js';
import { User } from '../models/user.js';
import logger from '../utils/logger.js';

const listsRouter = express.Router();

// --- Endpoint to get all lists ---
listsRouter.get('/', async (req, res, next) => {
  try {
    logger.info('entering get Lists endpoint');
    const lists = await List.find();
    logger.info(lists);
    res.json(lists);
  } catch (err) {
    next(err);
  }
});

// --- Endpoint to add a ticker to a list ---
listsRouter.post('/:id/tickers', async (req, res, next) => {
  try {
    logger.info('entering add a new ticker in a List endpoint');
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
    logger.info(list);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// --- Endpoint to create a new list ---
listsRouter.post('/', async (req, res, next) => {
  try {
    logger.info('entering post List endpoint');
    const body = req.body;

    if (body.name === undefined) {
      return res.status(400).json({ error: 'name missing' });
    }

    if (body.username === undefined) {
      return res.status(400).json({ error: 'username missing' });
    }

    // Find the user by username
    const user = await User.findOne({ username: body.username });

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    const list = new List({
      name: body.name,
      tickers: body.tickers || [],
      user: user._id,
    });

    const savedList = await list.save();

    // Add the list to the user's lists array
    user.lists = user.lists.concat(savedList._id);
    await user.save();

    res.status(201).json(savedList);
  } catch (err) {
    next(err);
  }
});

// --- Endpoint to delete a list by ID ---
listsRouter.delete('/:id', async (req, res, next) => {
  try {
    logger.info('entering delete List endpoint');
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ error: 'list not found' });
    }

    // Remove the list from the user's lists array
    console.log(`finding user ${list.user} to update lists array`);
    const user = await User.findById(list.user);
    if (user) {
      user.lists = user.lists.filter(listId => !listId.equals(list._id));
      await user.save();
    }

    await List.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// --- Endpoint to delete a ticker from a list ---
listsRouter.delete('/:id/tickers/:ticker', async (req, res, next) => {
  try {
    logger.info('entering delete ticker from List endpoint');
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ error: 'list not found' });
    }

    const tickerToRemove = req.params.ticker;
    list.tickers = list.tickers.filter((t) => t !== tickerToRemove);

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (err) {
    next(err);
  }
});

export default listsRouter;
