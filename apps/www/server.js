import { createRequestHandler } from '@react-router/express';
import express from 'express';
import * as build from './dist/server/index.js';

const app = express();

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

app.use(express.static('dist/client'));

app.all(
  '/{*splat}',
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV ?? 'production',
  }),
);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
