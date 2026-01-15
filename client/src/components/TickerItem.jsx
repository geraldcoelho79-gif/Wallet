function TickerItem({ ticker, listId, onDeleteTicker }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={() => onDeleteTicker(listId, ticker)}
        style={{ cursor: 'pointer', fontSize: '0.8em' }}
      >
        Delete
      </button>
      {ticker}
    </li>
  );
}

export default TickerItem;
