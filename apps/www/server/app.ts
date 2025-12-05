import 'react-router';
import { createRequestHandler } from '@react-router/express';
import express from 'express';

export const app = express();

app.use((req, res, next) => {
  /* Stop TRACE request */
  if (req.method === 'TRACE') {
    res
      .status(405)
      .type('text/plain; charset=utf-8')
      .send('method not allowed');
    return;
  }
  next();
});

app.use(
  createRequestHandler({
    build: () => import('virtual:react-router/server-build'),
  }),
);
