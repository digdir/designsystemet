import 'react-router';
import { createRequestHandler } from '@react-router/express';
import express from 'express';

import { securityHeaders } from './security-headers.js';

/* The app the development server in `server.js` loads through Vite. The production server builds the same chain itself. */
export const app = express();

app.use(securityHeaders);

app.use(
  createRequestHandler({
    build: () => import('virtual:react-router/server-build'),
  }),
);
