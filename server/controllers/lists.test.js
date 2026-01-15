
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app.js';
import { List } from '../models/list.js';
import { User } from '../models/user.js';
import { initialLists, initialUsers } from '../tests/test_helper.js';

// if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.
const api = supertest(app);

beforeEach(async () => {
  await List.deleteMany({});
  await User.deleteMany({});

  // Create users first (without lists references yet)
  const userObjects = initialUsers.map(user => new User({
    username: user.username,
    name: user.name,
    password: user.password,
    lists: []
  }));
  const savedUsers = await Promise.all(userObjects.map(user => user.save()));

  // Create a map of username to user._id
  const userMap = {};
  savedUsers.forEach(user => {
    userMap[user.username] = user._id;
  });

  // Create lists with user references based on username
  const listObjects = initialLists.map(list => new List({
    name: list.name,
    tickers: list.tickers,
    user: userMap[list.username]
  }));
  const savedLists = await Promise.all(listObjects.map(list => list.save()));

  // Create a map of list name to list._id
  const listMap = {};
  savedLists.forEach(list => {
    listMap[list.name] = list._id;
  });

  // Update users with their list references
  for (const initialUser of initialUsers) {
    const user = savedUsers.find(u => u.username === initialUser.username);
    user.lists = initialUser.lists.map(listName => listMap[listName]);
    await user.save();
  }
});

describe('when there are initially some lists saved', () => {
  test('lists are returned as json', async () => {
    await api
      .get('/lists')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all lists are returned', async () => {
    const response = await api.get('/lists');
    expect(response.body).toHaveLength(initialLists.length);
  });
});

describe('addition of a new list', () => {
  test('a valid list can be added', async () => {
    const newList = {
      name: 'Crypto',
      tickers: ['BTC', 'ETH'],
      username: 'testuser1'
    };

    const createResponse = await api
      .post('/lists')
      .send(newList)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/lists');
    const names = response.body.map(r => r.name);

    expect(response.body).toHaveLength(initialLists.length + 1);
    expect(names).toContain('Crypto');

    // Verify that the user has the new list in their lists array
    const usersResponse = await api.get('/users');
    const user = usersResponse.body.find(u => u.username === 'testuser1');

    expect(user.lists).toBeDefined();
    expect(user.lists).toContainEqual(createResponse.body);
  });

  test('list without name is not added', async () => {
    const newList = {
      tickers: ['BTC', 'ETH'],
      username: 'testuser1'
    };

    await api
      .post('/lists')
      .send(newList)
      .expect(400);

    const response = await api.get('/lists');
    expect(response.body).toHaveLength(initialLists.length);
  });

  test('list without username is not added', async () => {
    const newList = {
      name: 'Crypto',
      tickers: ['BTC', 'ETH']
    };

    await api
      .post('/lists')
      .send(newList)
      .expect(400);

    const response = await api.get('/lists');
    expect(response.body).toHaveLength(initialLists.length);
  });

  test('list with non-existent user is not added', async () => {
    const newList = {
      name: 'Crypto',
      tickers: ['BTC', 'ETH'],
      username: 'nonexistentuser'
    };

    await api
      .post('/lists')
      .send(newList)
      .expect(404);

    const response = await api.get('/lists');
    expect(response.body).toHaveLength(initialLists.length);
  });
});

describe('deletion of a list', () => {
  test('a list can be deleted', async () => {
    const listsAtStart = await api.get('/lists');
    const listToDelete = listsAtStart.body[0];

    // Get the user who owns this list before deletion
    const usersBeforeDeletion = await api.get('/users');
    const userBeforeDeletion = usersBeforeDeletion.body.find(u =>
      u.lists.some(list => list._id === listToDelete._id)
    );

    await api
      .delete(`/lists/${listToDelete._id}`)
      .expect(204);

    const listsAtEnd = await api.get('/lists');
    expect(listsAtEnd.body).toHaveLength(initialLists.length - 1);

    const names = listsAtEnd.body.map(r => r.name);
    expect(names).not.toContain(listToDelete.name);

    // Verify that the user no longer has the deleted list in their lists array
    const usersAfterDeletion = await api.get('/users');
    const userAfterDeletion = usersAfterDeletion.body.find(u =>
      u._id === userBeforeDeletion._id
    );

    expect(userAfterDeletion.lists).toBeDefined();
    expect(userAfterDeletion.lists.every(list => list._id !== listToDelete._id)).toBe(true);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});