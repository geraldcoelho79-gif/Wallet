
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app.js';
import { List } from '../models/list.js';
import { initialLists } from '../tests/test_helper.js';

// if the server is not already listening for connections then it is bound to an ephemeral port for you so there is no need to keep track of ports.
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

describe('addition of a new list', () => {
  test('a valid list can be added', async () => {
    const newList = {
      name: 'Crypto',
      tickers: ['BTC', 'ETH']
    };

    await api
      .post('/lists')
      .send(newList)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/lists');
    const names = response.body.map(r => r.name);

    expect(response.body).toHaveLength(initialLists.length + 1);
    expect(names).toContain('Crypto');
  });

  test('list without name is not added', async () => {
    const newList = {
      tickers: ['BTC', 'ETH']
    };

    await api
      .post('/lists')
      .send(newList)
      .expect(400);

    const response = await api.get('/lists');
    expect(response.body).toHaveLength(initialLists.length);
  });
});

describe('deletion of a list', () => {
  test('a list can be deleted', async () => {
    const listsAtStart = await api.get('/lists');
    const listToDelete = listsAtStart.body[0];

    await api
      .delete(`/lists/${listToDelete._id}`)
      .expect(204);

    const listsAtEnd = await api.get('/lists');
    expect(listsAtEnd.body).toHaveLength(initialLists.length - 1);

    const names = listsAtEnd.body.map(r => r.name);
    expect(names).not.toContain(listToDelete.name);
  });
});

describe('deletion of a ticker from a list', () => {
  test('a ticker can be deleted from a list', async () => {
    const listsAtStart = await api.get('/lists');
    const listToUpdate = listsAtStart.body[0];
    const tickerToDelete = listToUpdate.tickers[0];

    const response = await api
      .delete(`/lists/${listToUpdate._id}/tickers/${tickerToDelete}`)
      .expect(200);

    expect(response.body.tickers).not.toContain(tickerToDelete);
    expect(response.body.tickers).toHaveLength(listToUpdate.tickers.length - 1);

    const listsAtEnd = await api.get('/lists');
    const updatedList = listsAtEnd.body.find(l => l.id === listToUpdate.id);
    expect(updatedList.tickers).not.toContain(tickerToDelete);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});