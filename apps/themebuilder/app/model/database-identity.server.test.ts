import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ENDPOINT = 'http://localhost:42356/msi/token';
const WITHOUT_PASSWORD = 'postgres://themebuilder@db.example.com:5432/themes';
const WITH_PASSWORD = 'postgres://themebuilder:secret@db.example.com/themes';

/* The module keeps the last token, so every test loads it anew */
const load = () => import('./database-identity.server');

const tokenResponse = (token: string, secondsLeft = 3600) =>
  Response.json({
    access_token: token,
    expires_on: String(Math.floor(Date.now() / 1000) + secondsLeft),
  });

const stubFetch = (...responses: Response[]) => {
  const fetch = vi.fn<(url: URL, init: RequestInit) => Promise<Response>>();
  for (const response of responses) fetch.mockResolvedValueOnce(response);
  vi.stubGlobal('fetch', fetch);
  return fetch;
};

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('IDENTITY_ENDPOINT', ENDPOINT);
  vi.stubEnv('IDENTITY_HEADER', 'header-value');
  vi.stubEnv('DATABASE_IDENTITY_CLIENT_ID', '');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('usesDatabaseIdentity', () => {
  it('is when the URL has no password and the server has an identity', async () => {
    const { usesDatabaseIdentity } = await load();
    expect(usesDatabaseIdentity(WITHOUT_PASSWORD)).toBe(true);
    expect(usesDatabaseIdentity(WITH_PASSWORD)).toBe(false);
    vi.stubEnv('IDENTITY_ENDPOINT', '');
    expect(usesDatabaseIdentity(WITHOUT_PASSWORD)).toBe(false);
  });
});

describe('databaseToken', () => {
  it('asks the identity endpoint for a token for the database', async () => {
    const fetch = stubFetch(tokenResponse('token-1'));
    const { databaseToken } = await load();
    expect(await databaseToken()).toBe('token-1');

    const [url, init] = fetch.mock.calls[0];
    expect(`${url.origin}${url.pathname}`).toBe(ENDPOINT);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      resource: 'https://ossrdbms-aad.database.windows.net',
      'api-version': '2019-08-01',
    });
    expect(init.headers).toEqual({ 'X-IDENTITY-HEADER': 'header-value' });
  });

  it('asks for the identity with the client id when there is one', async () => {
    vi.stubEnv('DATABASE_IDENTITY_CLIENT_ID', 'client-id');
    const fetch = stubFetch(tokenResponse('token-1'));
    const { databaseToken } = await load();
    await databaseToken();
    expect(fetch.mock.calls[0][0].searchParams.get('client_id')).toBe(
      'client-id',
    );
  });

  it('uses a token until it is about to run out', async () => {
    const fetch = stubFetch(
      tokenResponse('token-1'),
      tokenResponse('token-2', 60),
      tokenResponse('token-3'),
    );
    const { databaseToken } = await load();
    // Connections that open at the same time share one request
    expect(await Promise.all([databaseToken(), databaseToken()])).toEqual([
      'token-1',
      'token-1',
    ]);
    expect(await databaseToken()).toBe('token-1');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('fetches a new token when the last one is about to run out', async () => {
    const fetch = stubFetch(
      tokenResponse('token-1', 60),
      tokenResponse('token-2'),
    );
    const { databaseToken } = await load();
    expect(await databaseToken()).toBe('token-1');
    expect(await databaseToken()).toBe('token-2');
    expect(await databaseToken()).toBe('token-2');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('fails without a token, and asks again the next time', async () => {
    stubFetch(
      new Response('no identity', { status: 400 }),
      Response.json({ error: 'no token here' }),
      tokenResponse('token-1'),
    );
    const { databaseToken } = await load();
    await expect(databaseToken()).rejects.toThrow('400');
    await expect(databaseToken()).rejects.toThrow('no token');
    expect(await databaseToken()).toBe('token-1');
  });
});
