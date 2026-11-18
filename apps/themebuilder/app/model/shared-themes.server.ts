import { randomInt } from 'node:crypto';
import postgres from 'postgres';
import cliPackage from '../../../../packages/cli/package.json';
import {
  databaseToken,
  usesDatabaseIdentity,
} from './database-identity.server';
import { validateConfig } from './import-config';
import {
  isSharedThemeId,
  isWithinShareLimits,
  SHARED_THEME_ID_CHARACTERS,
  SHARED_THEME_ID_LENGTH,
  type SharedThemeIds,
} from './shared-themes';
import type { WorkspaceConfig } from './theme-workspace';

/**
 * Themes that users have chosen to share. Each one is saved under a random id, and is updated as it is edited
 * by anyone who has opened its link. The id is the only key: whoever has it can read and change the theme.
 * A theme also has a view id, which only lets whoever has it read the theme. Nothing about the user is saved.
 *
 * The themes are rows in the Postgres database that `DATABASE_URL` points to. Themes cannot be shared without it;
 * see `canShareThemes`. The URL has a password, or none when the server signs in as its managed identity;
 * see `database-identity.server.ts`.
 *
 * `config` is `json`, not `jsonb`: the order of the colors in a config is the order they are shown in,
 * and `jsonb` does not keep the order of keys. For the same reason the config is sent as text
 * (`::text::json`) and not with `sql.json`, which sends `jsonb`.
 *
 * `version` is the version of Designsystemet the config was last saved with, to be able to migrate old configs later.
 * `revision` counts the updates of a theme. Nothing reads it yet; it is there so that an update can later be
 * turned down when it is based on an older revision, which is needed when two people edit the same theme.
 */

/** Whether themes can be shared, which they can when there is a database to save them in */
export const canShareThemes = () => !!process.env.DATABASE_URL;

type Database = { sql: postgres.Sql; ready: Promise<unknown> };

let database: Database | undefined;

const hasTable = async (sql: postgres.Sql) =>
  (await sql`select to_regclass('shared_themes') is not null as exists`)[0]
    .exists;

/**
 * Makes the table when the database does not have it. It is only made when it is missing, so that a database user
 * that cannot make tables can be used when the table is there already. The table is only made here, not changed:
 * a later change to it needs a migration.
 */
async function ensureTable(sql: postgres.Sql) {
  if (await hasTable(sql)) return;
  try {
    await sql`
      create table if not exists shared_themes (
        id text primary key check (id ~ '^[A-Za-z0-9]{10}$'),
        view_id text not null unique check (view_id ~ '^[A-Za-z0-9]{10}$'),
        version text not null,
        config json not null,
        revision integer not null default 1,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `;
  } catch (error) {
    // Two servers that start at the same time can both try to make it, and one of them fails
    if (!(await hasTable(sql))) throw error;
  }
}

/** Connects on the first use, and makes sure the table is there */
async function connect() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  if (!database) {
    const sql = postgres(process.env.DATABASE_URL, {
      // Without a password in the URL, a server in Azure signs in as its managed identity
      ...(usesDatabaseIdentity(process.env.DATABASE_URL) && {
        password: databaseToken,
      }),
      max: 5,
      idle_timeout: 30,
      connect_timeout: 10,
      // A query that hangs gives up, so that requests do not pile up behind it
      connection: { statement_timeout: 5000 },
      onnotice: false,
    });
    const ready = ensureTable(sql);
    const connected = { sql, ready };
    database = connected;
    // A database that could not be reached is tried again on the next request
    ready.catch(() => {
      if (database === connected) database = undefined;
      void sql.end({ timeout: 0 }).catch(() => {});
    });
  }
  const { sql, ready } = database;
  await ready;
  return sql;
}

/** Closes the connections to the database. Only tests need this; the server keeps them for as long as it runs. */
export async function closeDatabase() {
  const connected = database;
  database = undefined;
  await connected?.sql.end();
}

const randomId = () =>
  Array.from(
    { length: SHARED_THEME_ID_LENGTH },
    () =>
      SHARED_THEME_ID_CHARACTERS[randomInt(SHARED_THEME_ID_CHARACTERS.length)],
  ).join('');

/** Saves a config and returns its ids. The config must already be validated, see `readSharedConfig`. */
export async function saveSharedTheme(
  config: WorkspaceConfig,
): Promise<SharedThemeIds> {
  const sql = await connect();
  for (let attempt = 0; attempt < 5; attempt++) {
    const ids = { id: randomId(), viewId: randomId() };
    // An id or a view id that is taken is never overwritten
    const rows = await sql`
      insert into shared_themes (id, view_id, version, config)
      values (${ids.id}, ${ids.viewId}, ${cliPackage.version}, ${JSON.stringify(config)}::text::json)
      on conflict do nothing
      returning id
    `;
    if (rows.length) return ids;
  }
  throw new Error('Could not find a free id for the theme');
}

/**
 * Replaces the config of a theme, and returns whether there was a theme with the id.
 * The config must already be validated. The last update wins when two come at the same time.
 */
export async function updateSharedTheme(
  id: string,
  config: WorkspaceConfig,
): Promise<boolean> {
  if (!isSharedThemeId(id)) return false;
  const sql = await connect();
  const rows = await sql`
    update shared_themes
    set version = ${cliPackage.version},
        config = ${JSON.stringify(config)}::text::json,
        revision = revision + 1,
        updated_at = now()
    where id = ${id}
    returning id
  `;
  return rows.length === 1;
}

/** The config of a row, or `null` when it can no longer be shown */
function readConfig(saved: unknown): WorkspaceConfig | null {
  // Checked again, as the config may have been saved by an older version, or changed in the database
  const result = validateConfig(saved);
  return 'config' in result && isWithinShareLimits(result.config)
    ? result.config
    : null;
}

/** Returns the theme with the id, for editing, or `null` when there is none or it can no longer be shown. */
export async function readSharedTheme(
  id: string,
): Promise<{ config: WorkspaceConfig; viewId: string } | null> {
  if (!isSharedThemeId(id)) return null;
  const sql = await connect();
  const [row] =
    await sql`select config, view_id from shared_themes where id = ${id}`;
  const config = row && readConfig(row.config);
  return config ? { config, viewId: row.view_id } : null;
}

/** Returns the config of the theme with the view id, or `null` when there is none or it can no longer be shown. */
export async function readSharedThemeView(
  viewId: string,
): Promise<WorkspaceConfig | null> {
  if (!isSharedThemeId(viewId)) return null;
  const sql = await connect();
  const [row] =
    await sql`select config from shared_themes where view_id = ${viewId}`;
  return row ? readConfig(row.config) : null;
}
