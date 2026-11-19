import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import cliPackage from '../../../../packages/cli/package.json';
import { validateConfig } from './import-config';
import { isSharedThemeId } from './shared-themes';
import {
  canShareThemes,
  closeDatabase,
  readSharedTheme,
  readSharedThemeView,
  saveSharedTheme,
  updateSharedTheme,
} from './shared-themes.server';
import type { WorkspaceConfig } from './theme-workspace';

/**
 * These tests need a Postgres database, given as `TEST_DATABASE_URL`, and are skipped without it; see the README.
 * They run in a schema of their own that is removed afterwards, so the database can be one that is in use.
 * The database user must be allowed to make schemas.
 */
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

/** A config as the theme builder has it, which is how it is saved: with the severity colors every theme gets */
const workspaceConfig = (input: unknown): WorkspaceConfig => {
  const result = validateConfig(input);
  if (!('config' in result)) throw new Error('Expected a valid config');
  return result.config;
};

/* Not in alphabetical order, to see that the order is kept */
const colors = { neutral: '#1E2B3C', zebra: '#F45F63', accent: '#0062BA' };
const config = workspaceConfig({
  themes: { zebra: { colors }, apple: { colors } },
});
const edited = workspaceConfig({
  themes: { only: { colors: { neutral: '#000000' }, borderRadius: 12 } },
});

describe('canShareThemes', () => {
  it('is whether there is a database', () => {
    const before = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    expect(canShareThemes()).toBe(false);
    process.env.DATABASE_URL = 'postgres://localhost/themes';
    expect(canShareThemes()).toBe(true);
    if (before === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = before;
  });
});

describe.skipIf(!TEST_DATABASE_URL)('shared themes in a database', () => {
  const schema = `themebuilder_test_${randomBytes(6).toString('hex')}`;
  const before = process.env.DATABASE_URL;
  let admin: postgres.Sql;
  let sql: postgres.Sql;

  beforeAll(async () => {
    admin = postgres(TEST_DATABASE_URL as string, { max: 1, onnotice: false });
    await admin`create schema ${admin(schema)}`;
    /* Parameters of the URL that are not about the connection itself are settings of its session */
    const url = new URL(TEST_DATABASE_URL as string);
    url.searchParams.set('search_path', schema);
    process.env.DATABASE_URL = url.href;
    sql = postgres(url.href, { max: 1, onnotice: false });
  });

  afterAll(async () => {
    await closeDatabase();
    await sql.end();
    await admin`drop schema ${admin(schema)} cascade`;
    await admin.end();
    if (before === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = before;
  });

  const rowOf = async (id: string) =>
    (await sql`select * from shared_themes where id = ${id}`)[0];

  it('makes the table on the first use, in the schema of the test', async () => {
    const tableIn = async (schema: string) =>
      (await admin`select to_regclass(${`${schema}.shared_themes`}) as name`)[0]
        .name;
    expect(await tableIn(schema)).toBeNull();
    await saveSharedTheme(config);
    expect(await tableIn(schema)).not.toBeNull();
  });

  it('saves a config under two ids that open it', async () => {
    const { id, viewId } = await saveSharedTheme(config);
    expect(isSharedThemeId(id)).toBe(true);
    expect(isSharedThemeId(viewId)).toBe(true);
    expect(viewId).not.toBe(id);

    expect(await readSharedTheme(id)).toEqual({ config, viewId });
    expect(await readSharedThemeView(viewId)).toEqual(config);
    expect(await rowOf(id)).toMatchObject({
      version: cliPackage.version,
      revision: 1,
    });
  });

  it('keeps the order of the themes and colors', async () => {
    const { id, viewId } = await saveSharedTheme(config);
    for (const saved of [
      (await readSharedTheme(id))?.config,
      await readSharedThemeView(viewId),
    ]) {
      expect(Object.keys(saved?.themes ?? {})).toEqual(['zebra', 'apple']);
      expect(Object.keys(saved?.themes.zebra.colors ?? {}).slice(0, 3)).toEqual(
        ['neutral', 'zebra', 'accent'],
      );
    }
  });

  it('gives every theme ids of its own', async () => {
    const saved = await Promise.all(
      Array.from({ length: 5 }, () => saveSharedTheme(config)),
    );
    const ids = saved.flatMap(({ id, viewId }) => [id, viewId]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not let a view id edit, or an id be used as a view id', async () => {
    const { id, viewId } = await saveSharedTheme(config);
    expect(await readSharedTheme(viewId)).toBeNull();
    expect(await readSharedThemeView(id)).toBeNull();
    expect(await updateSharedTheme(viewId, edited)).toBe(false);
    expect(await readSharedThemeView(viewId)).toEqual(config);
  });

  it('replaces the config of a theme', async () => {
    const { id, viewId } = await saveSharedTheme(config);
    const other = await saveSharedTheme(config);
    const saved = await rowOf(id);

    expect(await updateSharedTheme(id, edited)).toBe(true);
    expect(await readSharedTheme(id)).toEqual({ config: edited, viewId });
    expect(await readSharedThemeView(viewId)).toEqual(edited);
    const updated = await rowOf(id);
    expect(updated.revision).toBe(2);
    expect(updated.created_at).toEqual(saved.created_at);
    expect(updated.updated_at > saved.updated_at).toBe(true);
    // Only the theme with the id is changed
    expect((await readSharedTheme(other.id))?.config).toEqual(config);
  });

  it('finds nothing for ids that do not exist or are not ids', async () => {
    for (const id of ['AAAAAAAAAA', 'short', '', "' or 1=1 --", 'AAAAAAAAA%']) {
      expect(await readSharedTheme(id)).toBeNull();
      expect(await readSharedThemeView(id)).toBeNull();
      expect(await updateSharedTheme(id, edited)).toBe(false);
    }
  });

  it('does not open a config that is no longer valid', async () => {
    const { id, viewId } = await saveSharedTheme(config);
    await sql`update shared_themes set config = '{"themes":{"one":{"colors":{"accent":"blue"}}}}' where id = ${id}`;
    expect(await readSharedTheme(id)).toBeNull();
    expect(await readSharedThemeView(viewId)).toBeNull();
    // It can still be replaced with one that is
    expect(await updateSharedTheme(id, edited)).toBe(true);
    expect(await readSharedThemeView(viewId)).toEqual(edited);
  });

  it('only takes ids of the right form into the table', async () => {
    const insert = (id: string, viewId: string) =>
      sql`insert into shared_themes (id, view_id, version, config) values (${id}, ${viewId}, '1', '{}')`;
    await expect(insert('short', 'AAAAAAAAAA')).rejects.toThrow();
    await expect(insert('AAAAAAAAAA', 'not-an-id!')).rejects.toThrow();
  });

  it('connects again after the connections are closed', async () => {
    const { id } = await saveSharedTheme(config);
    await closeDatabase();
    expect((await readSharedTheme(id))?.config).toEqual(config);
  });

  /* Stands in for Azure: the token the identity endpoint gives is the password of the test database,
   * so the database must be one that asks for a password. */
  it('signs in with a token from the identity of the server when the URL has no password', async () => {
    const withPassword = process.env.DATABASE_URL as string;
    const url = new URL(withPassword);
    const token = decodeURIComponent(url.password);
    url.password = '';

    const requests: { url?: string; header?: string | string[] }[] = [];
    const endpoint = createServer((request, response) => {
      requests.push({
        url: request.url,
        header: request.headers['x-identity-header'],
      });
      response.setHeader('Content-Type', 'application/json');
      response.end(
        JSON.stringify({
          access_token: token,
          expires_on: String(Math.floor(Date.now() / 1000) + 3600),
        }),
      );
    });
    await new Promise<void>((resolve) =>
      endpoint.listen(0, '127.0.0.1', resolve),
    );
    const { port } = endpoint.address() as AddressInfo;

    await closeDatabase();
    process.env.DATABASE_URL = url.href;
    vi.stubEnv('IDENTITY_ENDPOINT', `http://127.0.0.1:${port}/msi/token`);
    vi.stubEnv('IDENTITY_HEADER', 'header-value');
    vi.stubEnv('DATABASE_IDENTITY_CLIENT_ID', 'client-id');
    try {
      const { id } = await saveSharedTheme(config);
      expect((await readSharedTheme(id))?.config).toEqual(config);
      expect(requests).toHaveLength(1);
      expect(requests[0].header).toBe('header-value');
      expect(requests[0].url).toContain('client_id=client-id');
    } finally {
      await closeDatabase();
      vi.unstubAllEnvs();
      process.env.DATABASE_URL = withPassword;
      endpoint.close();
    }
  });
});
