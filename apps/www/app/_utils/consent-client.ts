/**
 * Client-side consent utility - reads the designsystemet-consent cookie
 */

import { userConsent } from './cookies';

export type ConsentChoice = 'all' | 'required' | null;

export async function getConsentFromCookie(): Promise<{
  choice: ConsentChoice;
  version: string | null;
} | null> {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const parsed = await userConsent.parse(document.cookie);
    return parsed;
  } catch {
    return null;
  }
}

export async function hasConsent(): Promise<boolean> {
  const consent = await getConsentFromCookie();
  return consent !== null;
}

export async function shouldIncludeSiteimprove(): Promise<boolean> {
  const consent = await getConsentFromCookie();
  return consent !== null && consent.choice === 'all';
}
