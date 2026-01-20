import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app.js';
import { User } from '../models/user.js';
import { List } from '../models/list.js';
import { initialUsers } from '../tests/test_helper.js';

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await List.deleteMany({});

  const userObjects = initialUsers.map(user => new User({
    username: user.username,
    name: user.name,
    passwordHash: user.passwordHash,
    lists: []
  }));
  await Promise.all(userObjects.map(user => user.save()));
});

describe('when there are initially some users saved', () => {
  test('users are returned as json', async () => {
    await api
      .get('/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all users are returned', async () => {
    const response = await api.get('/users');
    expect(response.body).toHaveLength(initialUsers.length);
  });
});

describe('addition of a new user', () => {
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'testuser3',
      name: 'Test User 3',
      password: 'password789'
    };

    await api
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/users');
    const usernames = response.body.map(r => r.username);

    expect(response.body).toHaveLength(initialUsers.length + 1);
    expect(usernames).toContain('testuser3');
  });

  test('user without username is not added', async () => {
    const newUser = {
      name: 'Test User',
      password: 'password123'
    };

    await api
      .post('/users')
      .send(newUser)
      .expect(400);

    const response = await api.get('/users');
    expect(response.body).toHaveLength(initialUsers.length);
  });

  test('user without name is not added', async () => {
    const newUser = {
      username: 'testuser3',
      password: 'password123'
    };

    await api
      .post('/users')
      .send(newUser)
      .expect(400);

    const response = await api.get('/users');
    expect(response.body).toHaveLength(initialUsers.length);
  });

  test('user without password is not added', async () => {
    const newUser = {
      username: 'testuser3',
      name: 'Test User 3'
    };

    await api
      .post('/users')
      .send(newUser)
      .expect(400);

    const response = await api.get('/users');
    expect(response.body).toHaveLength(initialUsers.length);
  });

  test('created user has empty lists array', async () => {
    const newUser = {
      username: 'testuser3',
      name: 'Test User 3',
      password: 'password789'
    };

    const response = await api
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(response.body.lists).toBeDefined();
    expect(response.body.lists).toHaveLength(0);
  });

  test('user with duplicate username is not added', async () => {
    const newUser = {
      username: 'testuser1',
      name: 'Duplicate User',
      password: 'password999'
    };

    const result = await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const response = await api.get('/users');
    expect(response.body).toHaveLength(initialUsers.length);
  });
});

describe('deletion of a user', () => {
  test('a user can be deleted', async () => {
    const usersAtStart = await api.get('/users');
    const userToDelete = usersAtStart.body[0];

    await api
      .delete(`/users/${userToDelete.id}`)
      .expect(204);

    const usersAtEnd = await api.get('/users');
    expect(usersAtEnd.body).toHaveLength(initialUsers.length - 1);

    const usernames = usersAtEnd.body.map(r => r.username);
    expect(usernames).not.toContain(userToDelete.username);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
