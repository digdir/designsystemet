import { createCookie } from 'react-router';

export const CONSENT_VERSION = '1';

export const userConsent = createCookie('designsystemet-consent', {
  maxAge: 31_536_000, // 1 year
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});
