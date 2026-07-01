import { createRequestHandler } from '@react-router/express';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import {
  extraSecurityHeaders,
  helmetMiddleware,
} from './server/security-headers.js';

// Short-circuit the type-checking of the built output.
const BUILD_PATH = './dist/server/index.js';
const CLIENT_DIR = 'dist/client';
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '3001', 10);

const isValidPort = (n) => Number.isInteger(n) && n >= 1 && n <= 65535;

if (!isValidPort(PORT)) {
  console.error(
    `Invalid PORT: "${process.env.PORT}". Must be an integer between 1 and 65535.`,
  );
  process.exit(1);
}

const app = express();

app.disable('x-powered-by');

if (!DEVELOPMENT) app.set('trust proxy', 1); // single reverse-proxy hop in front of prod

app.use(compression());
app.use(morgan(DEVELOPMENT ? 'dev' : 'tiny'));

// Server startup
if (DEVELOPMENT) {
  await startDevServer(app);
} else {
  await startProdServer(app);
}

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
server.headersTimeout = 60_000;
server.requestTimeout = 60_000;

// --- route handlers & setup functions ----------------------------------

async function startDevServer(app) {
  console.log('Starting development server');
  const viteDevServer = await import('vite').then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule('./server/app.ts');
      return await source.app(req, res, next);
    } catch (error) {
      if (typeof error === 'object' && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
}

async function startProdServer(app) {
  console.log('Starting production server');
  app.use(
    '/assets',
    express.static(`${CLIENT_DIR}/assets`, { immutable: true, maxAge: '1y' }),
  );
  app.use(
    '/.well-known',
    express.static(`${CLIENT_DIR}/.well-known`, { maxAge: '1y' }),
  );
  app.use(express.static(CLIENT_DIR, { maxAge: '30d' }));

  // RR v8 emits the server build (not the bundled `server/app.ts`) at
  // BUILD_PATH, so drive the request handler from it directly. `helmetMiddleware`
  // + `extraSecurityHeaders` replace the middleware that the bundled
  // `server/app.ts` used to provide.
  app.use(helmetMiddleware);
  app.use(extraSecurityHeaders);

  app.use(
    createRequestHandler({
      build: () => import(BUILD_PATH),
    }),
  );
}
