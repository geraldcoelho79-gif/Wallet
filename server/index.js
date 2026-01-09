import express from 'express';

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;

app.use(express.static('./server/dist'))

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// An api endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server !!" });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});