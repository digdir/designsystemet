import 'react-router';
import { createRequestHandler } from '@react-router/express';
import express from 'express';
import { extraSecurityHeaders, helmetMiddleware } from './security-headers';

export const app = express();

app.use(helmetMiddleware);
app.use(extraSecurityHeaders);

app.use(
  createRequestHandler({
    build: () => import('virtual:react-router/server-build'),
  }),
);
