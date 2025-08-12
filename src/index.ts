import dotenv from 'dotenv';
dotenv.config();
import decksRouter from './decks/router';
import flashcardsRouter from './flashcards/router';
import userRouter from './users/router';
import savedRouter from './saved-decks/router';
import progressRouter from './progress/router';
import lastReviewRouter from './last-review/router';
import sessionRouter from './session/router';

import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());

app.use(express.json({limit: '10mb'}));
app.use('/decks', decksRouter);
app.use('/flashcards', flashcardsRouter);
app.use('/users', userRouter);
app.use('/saved', savedRouter);
app.use('/progress', progressRouter);
app.use('/last-review', lastReviewRouter);
app.use('/session', sessionRouter)



app.get('/', (_req, res) => {
  res.send(`Hello! Secret is: ${process.env.MY_SECRET}`);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
