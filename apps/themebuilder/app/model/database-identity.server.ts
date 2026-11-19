/**
 * Signing in to the database as the managed identity of the app, instead of with a password.
 * In Azure the app is given an identity, and the database has a user for that identity. The app asks Azure
 * for a token that proves it is the identity, and signs in with the token as the password. A token lasts
 * for a while, so a new one is fetched when a connection is opened after the last one is about to run out.
 *
 * Azure gives an app with an identity `IDENTITY_ENDPOINT`, where it asks for tokens, and `IDENTITY_HEADER`,
 * which it sends along. `DATABASE_IDENTITY_CLIENT_ID` says which identity to use, and is needed for one that
 * is made on its own and added to the app. Without it the identity the app was made with is used.
 */

/** What Azure calls its Postgres databases when a token is asked for */
const DATABASE_RESOURCE = 'https://ossrdbms-aad.database.windows.net';

/** A token with less than this left is not used, so that it does not run out while a connection signs in */
const MARGIN_MS = 5 * 60_000;

type Token = { value: string; expiresAt: number };

let latest: Token | undefined;
let pending: Promise<Token> | undefined;

/**
 * Whether the server signs in to the database as its managed identity. It does when the URL of the database
 * has no password and the server has an identity to ask for a token with.
 */
export const usesDatabaseIdentity = (databaseUrl: string) =>
  !!process.env.IDENTITY_ENDPOINT && !URL.parse(databaseUrl)?.password;

async function fetchToken(): Promise<Token> {
  const url = new URL(process.env.IDENTITY_ENDPOINT ?? '');
  url.searchParams.set('resource', DATABASE_RESOURCE);
  url.searchParams.set('api-version', '2019-08-01');
  const clientId = process.env.DATABASE_IDENTITY_CLIENT_ID;
  if (clientId) url.searchParams.set('client_id', clientId);

  const response = await fetch(url, {
    headers: { 'X-IDENTITY-HEADER': process.env.IDENTITY_HEADER ?? '' },
    signal: AbortSignal.timeout(5000),
  });
  // The body is left out of the error: it is logged, and what it holds is not known
  if (!response.ok)
    throw new Error(
      `Could not get a token for the database: ${response.status}`,
    );
  const body: { access_token?: unknown; expires_on?: unknown } =
    await response.json();
  if (typeof body.access_token !== 'string' || !body.access_token)
    throw new Error('Could not get a token for the database: no token');
  // `expires_on` is in seconds. A token without it is used once and then fetched again.
  return {
    value: body.access_token,
    expiresAt: Number(body.expires_on) * 1000,
  };
}

/** The token to sign in to the database with. Connections that open at the same time share one request. */
export async function databaseToken(): Promise<string> {
  if (latest && latest.expiresAt - Date.now() > MARGIN_MS) return latest.value;
  pending ??= fetchToken().finally(() => {
    pending = undefined;
  });
  latest = await pending;
  return latest.value;
}
