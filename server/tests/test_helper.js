const initialUsers = [
  {
    username: 'testuser1',
    name: 'Test User 1',
    passwordHash: '$2b$10$XY6Z9OeKQqX7V9V9V9V9VuOz9V9V9V9V9V9V9V9V9V9V9V9V9V9V9', // hash of 'password123'
    lists: ['My Watchlist'], // List names owned by this user
  },
  {
    username: 'testuser2',
    name: 'Test User 2',
    passwordHash: '$2b$10$XY6Z9OeKQqX7V9V9V9V9VuOz9V9V9V9V9V9V9V9V9V9V9V9V9V9V9', // hash of 'password123'
    lists: ['Tech Stocks'], // List names owned by this user
  },
];

const initialLists = [
  {
    name: 'My Watchlist',
    tickers: ['AAPL', 'GOOGL'],
    username: 'testuser1', // This list belongs to testuser1
  },
  {
    name: 'Tech Stocks',
    tickers: ['MSFT', 'AMZN'],
    username: 'testuser2', // This list belongs to testuser2
  },
];

export { initialLists, initialUsers };