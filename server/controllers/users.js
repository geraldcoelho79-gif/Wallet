import express from 'express';
import { User } from '../models/user.js';
import logger from '../utils/logger.js';

const usersRouter = express.Router();

// --- Endpoint to get all users with their lists (populate)---
usersRouter.get('/', async (req, res, next) => {
  logger.info('entering get Users endpoint');
  try {
    const users = await User.find().populate('lists');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// --- Endpoint to create a new user ---
usersRouter.post('/', async (req, res, next) => {
  logger.info('entering post Users endpoint');
  try {
    const body = req.body;

    if (body.username === undefined) {
      return res.status(400).json({ error: 'username missing' });
    }

    if (body.name === undefined) {
      return res.status(400).json({ error: 'name missing' });
    }

    if (body.password === undefined) {
      return res.status(400).json({ error: 'password missing' });
    }

    const user = new User({
      username: body.username,
      name: body.name,
      password: body.password,
      lists: [],
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

// --- Endpoint to delete a user by ID ---
usersRouter.delete('/:id', async (req, res, next) => {
  try {
    logger.info('entering delete Users endpoint');
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default usersRouter;
