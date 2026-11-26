const DEVELOPMENT = process.env.NODE_ENV === 'development';

const csp = {
  'default-src': ["'none'"],
  'base-uri': ["'self'"],
  'script-src': [
    "'self'",
    /* React Router hydrates from inline scripts */
    "'unsafe-inline'",
    "'unsafe-eval'",
    /* react-scan, see `app/root.tsx`. Without a scheme, since it is loaded over the scheme of the page */
    DEVELOPMENT && 'unpkg.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://altinncdn.no'],
  'font-src': ["'self'", 'data:', 'https://altinncdn.no'],
  'img-src': ["'self'", 'data:'],
  'connect-src': [
    "'self'",
    'https://altinncdn.no',
    /* Vite HMR */
    DEVELOPMENT && 'ws://localhost:*',
    /* The version check of react-scan */
    DEVELOPMENT && 'https://www.react-grab.com',
  ],
  'frame-ancestors': ["'self'"],
  'form-action': ["'self'"],
  'manifest-src': ["'self'"],
  /* Violations on a developer's machine are not worth reporting */
  'report-uri': DEVELOPMENT ? [] : ['https://csp-report.digdir.no/api/reports'],
};

const contentSecurityPolicy = Object.entries(csp)
  .map(([directive, sources]) => [directive, sources.filter(Boolean)])
  .filter(([, sources]) => sources.length > 0)
  .map(([directive, sources]) => [directive, ...sources].join(' '))
  .join('; ');

/**
 * Security/CSP headers and TRACE blocking, for both servers:
 * `server/app.ts` in development and `server.js` in production.
 */
export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Content-Security-Policy', contentSecurityPolicy);
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
}
