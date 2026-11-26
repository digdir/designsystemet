import 'react-router';
import { createRequestHandler } from '@react-router/express';
import express from 'express';

import { ssrCacheControl } from './security-headers.js';

/* The app the development server in `server.js` loads through Vite. The production server builds the same chain itself.
 * The security headers are set by `server.js`, for both. */
export const app = express();

app.use(ssrCacheControl);

app.use(
  createRequestHandler({
    build: () => import('virtual:react-router/server-build'),
  }),
);
