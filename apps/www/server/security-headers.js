const DEVELOPMENT = process.env.NODE_ENV === 'development';

const connectSrc = [
  "'self'",
  'https://altinncdn.no',
  DEVELOPMENT && 'ws://localhost:*',
]
  .filter(Boolean)
  .join(' ');

/**
 * Security/CSP headers, homepage Link headers (RFC 8288 / RFC 9727) and TRACE
 * blocking.
 *
 * In RR v7 these were applied by the bundled `server/app.ts`. Under RR v8 the
 * SSR build no longer bundles `server/app.ts` (it emits the React Router server
 * build instead), so the production server in `server.js` drives the request
 * handler directly and applies this middleware itself. Keep in sync with the
 * inline copy in `server/app.ts`, which still serves the dev server.
 */
export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  );
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    `default-src 'none';base-uri 'self';script-src 'self' 'unsafe-inline' 'unsafe-eval';style-src 'self' https://altinncdn.no https://siteimproveanalytics.com 'unsafe-inline';font-src 'self' https://altinncdn.no;img-src 'self' data:;connect-src ${connectSrc};frame-ancestors 'self';form-action 'self';manifest-src 'self'; report-uri https://csp-report.digdir.no/api/reports`,
  );

  res.setHeader('Cache-Control', 'max-age');

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
