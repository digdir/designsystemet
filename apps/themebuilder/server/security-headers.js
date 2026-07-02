import helmet from 'helmet';

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const connectSrc = [
  "'self'",
  'https://altinncdn.no',
  DEVELOPMENT && 'ws://localhost:*',
]
  .filter(Boolean)
  .join(' ');

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    reportOnly: true,
    directives: {
      defaultSrc: ["'none'"],
      baseUri: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: [
        "'self'",
        'https://altinncdn.no',
        'https://siteimproveanalytics.com',
        "'unsafe-inline'",
      ],
      fontSrc: ["'self'", 'https://altinncdn.no'],
      imgSrc: ["'self'", 'data:'],
      connectSrc,
      frameAncestors: ["'self'"],
      formAction: ["'self'"],
      manifestSrc: ["'self'"],
      reportUri: ['https://csp-report.digdir.no/api/reports'],
    },
  },

  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
  frameguard: { action: 'sameorigin' },
  noSniff: true,
});

/**
 * Homepage Link headers (RFC 8288 / RFC 9727) and TRACE blocking.
 * Complements helmetMiddleware, which handles
 * the standard security headers and CSP.
 */
export function extraSecurityHeaders(req, res, next) {
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
