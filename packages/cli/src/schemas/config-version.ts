import { severityColors } from './defaults.ts';

/**
 * The config version where severity colors became optional. Older configs get the default severity colors
 * added to every theme; from this version a theme only has the severity colors listed in its `colors`.
 */
export const CONFIG_VERSION = 2;

/** The file name of the JSON schema in the package, e.g. `node_modules/@digdir/designsystemet/dist/config.v2.schema.json`. */
export const VERSIONED_SCHEMA_FILE = `config.v${CONFIG_VERSION}.schema.json`;
const UNVERSIONED_SCHEMA_FILE = 'config.schema.json';

const SCHEMA_URL_BASE = 'https://designsystemet.no/schemas/config/';

/**
 * The URL of the published JSON schema for a CLI version. Versions before {@link CONFIG_VERSION} get the first
 * version of it instead, so a config created by a pre-release isn't read as an older config.
 */
export const configSchemaUrl = (cliVersion: string): string => {
  const major = Number.parseInt(cliVersion, 10);
  return `${SCHEMA_URL_BASE}${major >= CONFIG_VERSION ? cliVersion : `${CONFIG_VERSION}.0.0`}.json`;
};

/**
 * The config version a `$schema` value stands for, or `undefined` when it has none. Configs have no version
 * field of their own, so the version is read from the schema they point to:
 *
 * - `https://designsystemet.no/schemas/config/2.1.0.json` is version 2
 * - `node_modules/@digdir/designsystemet/dist/config.v2.schema.json` is version 2
 * - `node_modules/@digdir/designsystemet/dist/config.schema.json` has no version
 */
export const getConfigVersion = (schema: unknown): number | undefined => {
  if (typeof schema !== 'string') return undefined;

  const file = schema.split(/[\\/]/).pop() ?? '';
  const local = /^config\.v(\d+)\.schema\.json$/.exec(file);
  if (local) return Number(local[1]);

  if (schema.startsWith(SCHEMA_URL_BASE)) {
    const published = /^(\d+)\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?\.json$/.exec(file);
    if (published) return Number(published[1]);
  }

  return undefined;
};

/** Whether a config is from before severity colors were optional, judged by its `$schema`. */
export const isLegacyConfig = (config: unknown): boolean => {
  if (!isRecord(config)) return false;
  return (getConfigVersion(config.$schema) ?? 0) < CONFIG_VERSION;
};

/**
 * The `$schema` a migrated config gets: the versioned file next to the one it pointed to, or the published
 * schema when it pointed to a URL. A config without `$schema` gets the file in the installed package.
 */
export const versionedSchema = (schema: unknown, cliVersion: string): string => {
  if (typeof schema !== 'string' || schema === '') {
    return `node_modules/@digdir/designsystemet/dist/${VERSIONED_SCHEMA_FILE}`;
  }
  if (/^https?:/.test(schema)) return configSchemaUrl(cliVersion);

  const separator = Math.max(schema.lastIndexOf('/'), schema.lastIndexOf('\\'));
  const file = schema.slice(separator + 1);
  // Keep a file name that isn't ours, e.g. a copy of the schema: only the default name is replaced.
  if (file !== UNVERSIONED_SCHEMA_FILE && !/^config\.v\d+\.schema\.json$/.test(file)) {
    return `node_modules/@digdir/designsystemet/dist/${VERSIONED_SCHEMA_FILE}`;
  }
  return `${schema.slice(0, separator + 1)}${VERSIONED_SCHEMA_FILE}`;
};

/**
 * The severity colors an older config gets for a theme: its `overrides.severity`, then the defaults,
 * for every severity color that isn't in `colors` already.
 */
export const legacySeverityColors = (theme: unknown): Record<string, string> => {
  if (!isRecord(theme)) return {};
  const colors = isRecord(theme.colors) ? theme.colors : {};
  const overrides = isRecord(theme.overrides) && isRecord(theme.overrides.severity) ? theme.overrides.severity : {};

  const added: Record<string, string> = {};
  for (const [name, defaultColor] of Object.entries(severityColors)) {
    if (Object.hasOwn(colors, name)) continue;
    const override = overrides[name];
    added[name] = typeof override === 'string' ? override : defaultColor;
  }
  return added;
};

/**
 * Gives a config from before {@link CONFIG_VERSION} the severity colors it had then, so it creates the same
 * theme as before. Configs from that version on are returned as they are. Does not change its argument.
 */
export const applyLegacyDefaults = <T>(config: T): T => {
  if (!isLegacyConfig(config) || !isRecord(config) || !isRecord(config.themes)) return config;

  const themes = Object.fromEntries(
    Object.entries(config.themes).map(([name, theme]) => {
      if (!isRecord(theme) || !isRecord(theme.colors)) return [name, theme];
      return [name, { ...theme, colors: { ...theme.colors, ...legacySeverityColors(theme) } }];
    }),
  );
  return { ...config, themes } as T;
};

/**
 * Turns a config from before {@link CONFIG_VERSION} into a current one: the severity colors it had by default
 * are in each theme's `colors`, `overrides.severity` is gone, and `$schema` is the published schema of
 * `cliVersion`. For tools that hold a config as an object, like the theme builder and the Figma plugin; the
 * CLI migrates the config file itself, keeping its comments. Current configs are returned as they are.
 */
export const toCurrentConfig = <T>(config: T, cliVersion: string): T => {
  if (!isLegacyConfig(config) || !isRecord(config)) return config;

  const { themes } = applyLegacyDefaults(config);
  const current: Record<string, unknown> = { $schema: configSchemaUrl(cliVersion) };
  for (const [key, value] of Object.entries(config)) {
    if (key !== '$schema') current[key] = value;
  }
  if (!isRecord(themes)) return current as T;

  current.themes = Object.fromEntries(
    Object.entries(themes).map(([name, theme]) => {
      if (!isRecord(theme) || !isRecord(theme.overrides) || !('severity' in theme.overrides)) return [name, theme];
      const { severity: _severity, ...overrides } = theme.overrides;
      const { overrides: _overrides, ...rest } = theme;
      return [name, Object.keys(overrides).length > 0 ? { ...rest, overrides } : rest];
    }),
  );
  return current as T;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
