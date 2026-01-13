import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app.js';
import { List } from '../models/list.js';
import { initialLists } from '../tests/test_helper.js';

const api = supertest(app);

beforeEach(async () => {
  await List.deleteMany({});
  const listObjects = initialLists.map(list => new List(list));
  const promiseArray = listObjects.map(list => list.save());
  await Promise.all(promiseArray);
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

afterAll(async () => {
  await mongoose.connection.close();
});