import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequestHandler } from '@react-router/express';
import compression from 'compression';
import express from 'express';
// import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { markdownNegotiation } from './server/markdown-negotiation.js';
import {
  extraSecurityHeaders,
  helmetMiddleware,
} from './server/security-headers.js';

// Short-circuit the type-checking of the built output.
const BUILD_PATH = './dist/server/index.js';
const CLIENT_DIR = 'dist/client';
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '3000', 10);

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
app.use(markdownNegotiation);
app.get('/.well-known/api-catalog', serveApiCatalog);

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

// Serve /.well-known/api-catalog with correct Content-Type (RFC 9727)
function serveApiCatalog(_req, res) {
  const filePath = DEVELOPMENT
    ? 'public/.well-known/api-catalog'
    : `${CLIENT_DIR}/.well-known/api-catalog`;

  try {
    const content = readFileSync(filePath, 'utf-8');
    res.setHeader(
      'Content-Type',
      'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    );
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(content);
  } catch {
    res.status(404).send('Not Found');
  }
}

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
  app.use(express.static(`${CLIENT_DIR}/img`, { maxAge: '30d' }));
  app.use(express.static(`${CLIENT_DIR}/animations`, { maxAge: '30d' }));

  // const htmlRateLimiter = rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  //   max: 100, // limit each IP to 100 requests per windowMs for prerendered HTML
  //   skip: (req) => !req.accepts('html'),
  // });

  // app.use(htmlRateLimiter);

  app.use(servePrerenderedHtml);
  app.use(express.static(CLIENT_DIR, { redirect: false }));

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

/** Serve prerendered HTML for clean URLs (e.g. /no/intro -> /no/intro/index.html) */
function servePrerenderedHtml(req, res, next) {
  if (req.path.includes('.') || req.path.startsWith('/assets')) {
    return next();
  }

  const clientRoot = path.resolve(CLIENT_DIR);
  const indexPath = path.join(clientRoot, req.path, 'index.html');

  if (!indexPath.startsWith(clientRoot + path.sep)) {
    return res.status(400).send('Bad Request');
  }

  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
}
