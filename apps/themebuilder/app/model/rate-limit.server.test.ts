import { afterEach, describe, expect, it, vi } from 'vitest';
import { clientKey, createRateLimiter } from './rate-limit.server';

const request = (forwardedFor?: string) =>
  new Request('http://localhost/api/themes', {
    headers: forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {},
  });

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('clientKey', () => {
  it('is the address the proxy got the request from, not one the client sent', () => {
    expect(clientKey(request('203.0.113.7'))).toBe('203.0.113.7');
    expect(clientKey(request('10.0.0.1, 203.0.113.7'))).toBe('203.0.113.7');
  });

  it('counts back as many proxies as the app runs behind', () => {
    vi.stubEnv('TRUSTED_PROXIES', '2');
    expect(clientKey(request('10.0.0.1, 203.0.113.7, 198.51.100.2'))).toBe(
      '203.0.113.7',
    );
    // With fewer entries than proxies the address of the client is not known
    expect(clientKey(request('198.51.100.2'))).toBe('unknown');
  });

  it('counts one proxy when the number of them is not a number above zero', () => {
    for (const proxies of ['', '0', '-2', 'many']) {
      vi.stubEnv('TRUSTED_PROXIES', proxies);
      expect(clientKey(request('10.0.0.1, 203.0.113.7'))).toBe('203.0.113.7');
    }
  });

  it('counts all clients as one without the header', () => {
    expect(clientKey(request())).toBe('unknown');
  });
});

describe('createRateLimiter', () => {
  it('takes hits up to the limit in a window, and again in the next', () => {
    const withinLimit = createRateLimiter(2, 1000);
    expect(withinLimit('a', 0)).toBe(true);
    expect(withinLimit.isUsedUp('a', 0)).toBe(false);
    expect(withinLimit('a', 10)).toBe(true);
    expect(withinLimit.isUsedUp('a', 10)).toBe(true);
    expect(withinLimit('a', 20)).toBe(false);
    // Other clients have counts of their own
    expect(withinLimit('b', 20)).toBe(true);
    expect(withinLimit('a', 1000)).toBe(true);
    expect(withinLimit.isUsedUp('a', 1000)).toBe(false);
  });
});
