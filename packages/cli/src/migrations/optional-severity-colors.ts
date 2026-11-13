import { applyEdits, modify } from 'jsonc-parser';
import pc from 'picocolors';
import pkg from '../../package.json' with { type: 'json' };
import { isLegacyConfig, legacySeverityColors, versionedSchema } from '../schemas/config-version.ts';
import { parseJsonc } from '../schemas/helpers.ts';

const formattingOptions = { insertSpaces: true, tabSize: 2 } as const;

type Automigrate = {
  name: string;
  check: (config: string) => boolean;
  message: string;
  yes: (config: string) => string;
  no: (config: string) => string;
};

type UnknownConfig = {
  $schema?: unknown;
  themes?: Record<string, { colors?: unknown; overrides?: Record<string, unknown> } | undefined>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const themesWithColors = (config: UnknownConfig) =>
  Object.entries(isRecord(config.themes) ? config.themes : {}).filter(([, theme]) => isRecord(theme?.colors));

/** A config from before severity colors were optional, with at least one theme to add them to. */
const hasImplicitSeverityColors = (config: string): boolean => {
  const currentConfig = parseJsonc<UnknownConfig>(config);
  return isLegacyConfig(currentConfig) && themesWithColors(currentConfig).length > 0;
};

/**
 * Writes the severity colors an older config got by default into every theme's `colors`, so the config
 * creates the same theme as before now that severity colors are optional. `overrides.severity` moves
 * into `colors` as well, and `$schema` is set to a versioned schema so the config isn't migrated again.
 * Comments and formatting are kept.
 */
export const migrateToOptionalSeverityColors = (config: string, cliVersion: string = pkg.version): string => {
  const currentConfig = parseJsonc<UnknownConfig>(config);
  let text = config;
  const edit = (path: (string | number)[], value: unknown, options = {}) => {
    text = applyEdits(text, modify(text, path, value, { formattingOptions, ...options }));
  };

  for (const [themeName, theme] of themesWithColors(currentConfig)) {
    for (const [colorName, color] of Object.entries(legacySeverityColors(theme))) {
      edit(['themes', themeName, 'colors', colorName], color);
    }

    const overrides = theme?.overrides;
    if (isRecord(overrides) && 'severity' in overrides) {
      // `overrides` is removed with it when severity was all it held.
      const isOnlyOverride = Object.keys(overrides).length === 1;
      edit(['themes', themeName, 'overrides', ...(isOnlyOverride ? [] : ['severity'])], undefined);
    }
  }

  edit(['$schema'], versionedSchema(currentConfig.$schema, cliVersion), { getInsertionIndex: () => 0 });

  return text;
};

const migration: Automigrate = {
  name: 'Optional severity colors',
  check: hasImplicitSeverityColors,
  message: `Severity colors (${pc.yellow('info')}, ${pc.yellow('success')}, ${pc.yellow('warning')} and ${pc.yellow('danger')}) are now optional, and are no longer added to a theme by default.\nThis migration adds them to ${pc.blue('colors')} in your themes, so your themes stay the same. You can remove the ones you don't use afterwards.\nIt also sets ${pc.blue('$schema')} to a versioned schema, which is how the CLI knows the config is migrated.\n`,
  yes: (config: string): string => {
    const migratedConfig = migrateToOptionalSeverityColors(config);
    console.log(pc.green(`\nConfig file successfully migrated.`));

    return migratedConfig;
  },
  no: (config: string): string => {
    // An unmigrated config still gets the default severity colors when it is validated, so it is used as it is.
    console.log(
      pc.yellow('\nUsing existing config file with the default severity colors, but migration was skipped.\n'),
    );
    return config;
  },
};

export default migration;
