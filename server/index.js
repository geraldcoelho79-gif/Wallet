import express from 'express';

const app = express();
const PORT = 3001;

// An api endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Hello from my new server !!!" });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});