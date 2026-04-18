import compression from 'compression';
import express from 'express';
import { readFileSync } from 'node:fs';
//import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { markdownNegotiation } from './server/markdown-negotiation.js';

// Short-circuit the type-checking of the built output.
const BUILD_PATH = './dist/server/index.js';
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '3000', 10);

const app = express();

app.use(compression());
app.use(markdownNegotiation);
app.disable('x-powered-by');

/* Serve /.well-known/api-catalog with correct Content-Type (RFC 9727) */
app.get('/.well-known/api-catalog', (req, res) => {
  const filePath = DEVELOPMENT
    ? 'public/.well-known/api-catalog'
    : 'dist/client/.well-known/api-catalog';
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
});

if (DEVELOPMENT) {
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
} else {
  console.log('Starting production server');
  app.use(
    '/assets',
    express.static('dist/client/assets', { immutable: true, maxAge: '1y' }),
  );
  app.use(morgan('tiny'));
  app.use(
    '/.well-known',
    express.static('dist/client/.well-known', { maxAge: '1y' }),
  );
  app.use(express.static('dist/client/img', { maxAge: '30d' }));
  app.use(express.static('dist/client/animations', { maxAge: '30d' }));

  /*   const htmlRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs for prerendered HTML
  }); */

  /* Serve prerendered HTML files for clean URLs (e.g., /no/intro -> /no/intro/index.html) */
  app.use((req, res, next) => {
    if (req.path.includes('.') || req.path.startsWith('/assets')) {
      return next();
    }

    const indexPath = `dist/client${req.path}/index.html`;
    res.sendFile(indexPath, { root: '.' }, (err) => {
      if (err) {
        next();
      }
    });
  });

  app.use(express.static('dist/client', { redirect: false }));
  app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
