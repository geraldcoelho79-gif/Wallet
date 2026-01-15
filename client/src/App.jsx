import { useEffect, useState } from 'react';
import StockList from './components/StockList';

function App() {
  // Hardcoded user - corresponds to Mongoose User schema
  const currentUser = {
    username: 'testuser1',
    name: 'Test User 1',
    password: 'password123'
  };

  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    fetch('/lists')
      .then((res) => res.json())
      .then((data) => {
        setLists(data);
      });
  }, []);

  const handleAddTicker = async (listId, ticker) => {
    try {
      const response = await fetch(`/lists/${listId}/tickers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) {
        throw new Error('Failed to add ticker');
      }

      const updatedList = await response.json();
      setLists(lists.map((list) => (list._id === listId ? updatedList : list)));
    } catch (error) {
      console.error('Error adding ticker:', error);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const response = await fetch('/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newListName,
          tickers: [],
          username: currentUser.username
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const newList = await response.json();
      setLists([...lists, newList]);
      setNewListName('');
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const response = await fetch(`/lists/${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      setLists(lists.filter((list) => list._id !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleDeleteTicker = async (listId, ticker) => {
    try {
      const response = await fetch(`/lists/${listId}/tickers/${ticker}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticker');
      }

      const updatedList = await response.json();
      setLists(lists.map((list) => (list._id === listId ? updatedList : list)));
    } catch (error) {
      console.error('Error deleting ticker:', error);
    }
  };

  return (
    <div>
      <h1>My Stock Lists</h1>
      <h2>Create New List</h2>
      <form onSubmit={handleCreateList}>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter list name"
        />
        <button type="submit">Create List</button>
      </form>

      {lists.length === 0 ? (
        <p>No lists yet. Create one above!</p>
      ) : (
        lists.map((list) => (
          <StockList
            key={list._id}
            list={list}
            onDeleteList={handleDeleteList}
            onDeleteTicker={handleDeleteTicker}
            onAddTicker={handleAddTicker}
          />
        ))
      )}
    </div>
  );
}

export default App;
