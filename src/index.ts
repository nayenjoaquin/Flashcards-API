import dotenv from 'dotenv';
dotenv.config();
import decksRouter from './decks/router';

import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use('/decks', decksRouter);

app.get('/', (_req, res) => {
  res.send(`Hello! Secret is: ${process.env.MY_SECRET}`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
