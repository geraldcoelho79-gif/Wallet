import { useEffect, useState } from "react";

function App() {
  const [list, setList] = useState(null);

  useEffect(() => {
    fetch("/lists")
      .then((res) => res.json())
      .then((data) => {
        // We'll take the first list from the response
        if (data && data.length > 0) {
          setList(data[0]);
        }
      });
  }, []);

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
    </div>
  );
}

export default App;
