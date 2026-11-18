/**
 * Limits how often one client can do something, counted in memory in fixed windows.
 * The counts are per server and are gone when it restarts, which is fine for slowing down abuse.
 * Returns a function that counts a hit for `key` and says whether it is within the limit.
 * Its `isUsedUp` says whether `key` has reached the limit, without counting a hit.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  const withinLimit = (key: string, now = Date.now()) => {
    if (hits.size > 10_000) {
      for (const [key, hit] of hits) if (hit.resetAt <= now) hits.delete(key);
    }
    const hit = hits.get(key);
    if (!hit || hit.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    hit.count++;
    return hit.count <= limit;
  };
  withinLimit.isUsedUp = (key: string, now = Date.now()) => {
    const hit = hits.get(key);
    return !!hit && hit.resetAt > now && hit.count >= limit;
  };
  return withinLimit;
}

/**
 * How many proxies the app runs behind. Each proxy adds the address it got the request from to the end of
 * `X-Forwarded-For`, so this is how far from the end the address of the client is. In Azure it is one, the ingress
 * of the container app. It must be raised with `TRUSTED_PROXIES` when something is put in front of that, such as
 * a CDN: otherwise all clients are counted as the one address of the CDN.
 */
const trustedProxies = () =>
  Math.max(1, Number.parseInt(process.env.TRUSTED_PROXIES ?? '', 10) || 1);

/**
 * What a client is counted by: its IP address, which is only held in memory and never saved or logged.
 * It is the address the first of the proxies got the request from, see `trustedProxies`. Earlier entries of
 * `X-Forwarded-For` come from the client and cannot be trusted. Without the header, as in development, or with
 * fewer entries than there are proxies, all clients are counted as one.
 */
export const clientKey = (request: Request) =>
  request.headers
    .get('x-forwarded-for')
    ?.split(',')
    .at(-trustedProxies())
    ?.trim() || 'unknown';
