import dotenv from 'dotenv';
dotenv.config();
import decksRouter from './decks/router';
import flashcardsRouter from './flashcards/router';
import userRouter from './users/router';
import savedRouter from './save-decks/router';

import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use('/decks', decksRouter);
app.use('/flashcards', flashcardsRouter);
app.use('/users', userRouter);
app.use('/saved', savedRouter);

app.get('/', (_req, res) => {
  res.send(`Hello! Secret is: ${process.env.MY_SECRET}`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
