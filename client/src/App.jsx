import { useEffect, useState } from 'react';

function App() {
  // first list document in MongoDB
  const [list, setList] = useState(null);
  const [newTicker, setNewTicker] = useState('');

  useEffect(() => {
    fetch('/lists')
      .then((res) => res.json())
      .then((data) => {
        // We'll take the first list from the response
        if (data && data.length > 0) {
          setList(data[0]);
        }
      });
  }, []);

  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newTicker.trim() || !list) return;

    try {
      const response = await fetch(`/lists/${list._id}/tickers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: newTicker }),
      });

      if (!response.ok) {
        throw new Error('Failed to add ticker');
      }

      const updatedList = await response.json();
      setList(updatedList);
      setNewTicker('');
    } catch (error) {
      console.error('Error adding ticker:', error);
    }
  };

  return (
    <div>
      <h1>My Stock List</h1>
      {!list ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {list.tickers.map((ticker, index) => (
            <li key={index}>{ticker}</li>
          ))}
        </ul>
      )}
      {list && (
        <form onSubmit={handleAddTicker}>
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            placeholder="Enter new ticker"
          />
          <button type="submit">Add Ticker</button>
        </form>
      )}
    </div>
  );
}

export default App;
