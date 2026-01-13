import express from 'express';
import { List } from '../models/list.js';
import logger from '../utils/logger.js';

const listsRouter = express.Router();

// --- Endpoint to get all lists ---
listsRouter.get('/', async (req, res, next) => {
  try {
    logger.info('entering endpoint');
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

export default listsRouter;
