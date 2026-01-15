import { useState } from 'react';
import TickerItem from './TickerItem';

function StockList({ list, onDeleteList, onDeleteTicker, onAddTicker }) {
  const [newTicker, setNewTicker] = useState('');

  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newTicker.trim()) return;

    await onAddTicker(list._id, newTicker);
    setNewTicker('');
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', position: 'relative' }}>
      <button
        onClick={() => onDeleteList(list._id)}
        style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
      >
        Delete
      </button>
      <h3>{list.name}</h3>
      <ul>
        {list.tickers.map((ticker, index) => (
          <TickerItem
            key={index}
            ticker={ticker}
            listId={list._id}
            onDeleteTicker={onDeleteTicker}
          />
        ))}
      </ul>
      <form onSubmit={handleAddTicker}>
        <input
          type="text"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          placeholder="Enter new ticker"
        />
        <button type="submit">Add Ticker</button>
      </form>
    </div>
  );
}

export default StockList;
