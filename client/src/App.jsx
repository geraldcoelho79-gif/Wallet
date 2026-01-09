import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api", { cache: "no-cache" })
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div>
      <p>{!data ? "Loading..." : data}</p>
    </div>
  );
}

export default App;
