import 'react-router';
import { createRequestHandler } from '@react-router/express';
import express from 'express';

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const connectSrc = [
  "'self'",
  'https://altinncdn.no',
  DEVELOPMENT && 'ws://localhost:*',
]
  .filter(Boolean)
  .join(' ');

export const app = express();

app.set('strict routing', true);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    `default-src 'none';base-uri 'self';script-src 'self' 'unsafe-inline' 'unsafe-eval';style-src 'self' https://altinncdn.no https://siteimproveanalytics.com 'unsafe-inline';font-src 'self' https://altinncdn.no;img-src 'self' data:;connect-src ${connectSrc};frame-ancestors 'self';form-action 'self';manifest-src 'self';`,
  );
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'max-age');
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
