import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send(`Hello! Secret is: ${process.env.MY_SECRET}`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
