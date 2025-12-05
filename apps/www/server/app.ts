import 'react-router';
import path from 'node:path';
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

/* Cache things. 365d is safe since everything is hashed */
const clientDir = path.join(process.cwd(), 'dist', 'client');

app.use(
  express.static(clientDir, {
    maxAge: '30d', // 30 days
    etag: true,
    immutable: true,
    index: false, // don’t auto-serve index.html, just in case
  }),
);

app.use(
  createRequestHandler({
    build: () => import('virtual:react-router/server-build'),
  }),
);
