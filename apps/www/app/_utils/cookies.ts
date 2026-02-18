import { createCookie } from 'react-router';

export const CONSENT_VERSION = '1';

const isProduction = process.env.NODE_ENV === 'production';

export const userConsent = createCookie('designsystemet-consent', {
  maxAge: 31_536_000, // 1 year
  path: '/',
  httpOnly: false, // Allow client-side JavaScript to read the cookie
  secure: isProduction,
  sameSite: 'lax',
});
