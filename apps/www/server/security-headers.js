const DEVELOPMENT = process.env.NODE_ENV === 'development';

/* Siteimprove is only loaded after consent, see `app/_components/siteimprove-script.tsx` */
const SITEIMPROVE_SCRIPT = 'https://siteimproveanalytics.com';
const SITEIMPROVE_TRACKING = 'https://*.siteimproveanalytics.io';

const csp = {
  'default-src': ["'none'"],
  'base-uri': ["'self'"],
  'script-src': [
    "'self'",
    /* React Router hydrates from inline scripts, and prerendered pages can not carry a nonce */
    "'unsafe-inline'",
    /* The live code examples (react-live) compile and run code in the browser */
    "'unsafe-eval'",
    SITEIMPROVE_SCRIPT,
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://altinncdn.no'],
  'font-src': ["'self'", 'https://altinncdn.no'],
  'img-src': ["'self'", 'data:', SITEIMPROVE_TRACKING],
  'media-src': ["'self'"],
  /* `ResponsiveIframe` frames our own video files */
  'frame-src': ["'self'"],
  'connect-src': [
    "'self'",
    'https://altinncdn.no',
    SITEIMPROVE_TRACKING,
    /* The Suggestion example that fetches its options */
    'https://dummyjson.com',
    /* Vite HMR */
    DEVELOPMENT && 'ws://localhost:*',
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
 * Security/CSP headers, homepage Link headers (RFC 8288 / RFC 9727) and TRACE
 * blocking.
 *
 * `server.js` applies this to every response, in development and production.
 * It has to run before the static middleware there: the prerendered pages are
 * served as static files, and would otherwise get none of these headers.
 */
export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Content-Security-Policy', contentSecurityPolicy);
  res.setHeader('Referrer-Policy', 'same-origin');

  /* Add Link headers for agent discovery (RFC 8288 / RFC 9727) on the homepage */
  if (req.path === '/') {
    res.setHeader('Link', [
      '</.well-known/api-catalog>; rel="api-catalog"',
      '</.well-known/security.txt>; rel="disclosure"',
      '</sitemap.xml>; rel="sitemap"',
    ]);
  }

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

/**
 * For the responses React Router renders. Kept apart from `securityHeaders`,
 * since the static middleware only sets its own `Cache-Control` when none is
 * set already.
 */
export function ssrCacheControl(_req, res, next) {
  res.setHeader('Cache-Control', 'max-age');
  next();
}
