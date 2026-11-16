import {
  type ExternalConfigSchemaInput,
  externalConfigSchema,
  flattenColors,
  isOldColorSchema,
} from '@digdir/designsystemet/internal';
import { normalizeConfig, type WorkspaceConfig } from './theme-workspace';

export type ImportedConfig =
  | { config: WorkspaceConfig }
  | { error: 'empty' | 'no-themes' }
  /** `messages` say what is wrong, in English, as they come from the JSON parser and the config schema */
  | { error: 'invalid'; messages: string[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Configs made before a theme's colors became one list have them in `main`, `support` and `neutral`.
 * They are moved into one list the way the CLI's migration does it.
 */
const flattenOldColors = (config: unknown) => {
  if (!isRecord(config) || !isRecord(config.themes)) return config;
  const themes = Object.fromEntries(
    Object.entries(config.themes).map(([name, theme]) => [
      name,
      isRecord(theme) && isOldColorSchema(theme)
        ? { ...theme, colors: flattenColors(theme.colors) }
        : theme,
    ]),
  );
  return { ...config, themes };
};

/**
 * Reads the text of a config file into a config the theme builder can edit.
 * This is the only way a config from outside gets into the theme builder: a pasted file and an old shared link both go through it.
 */
export function importConfig(text: string): ImportedConfig {
  if (!text.trim()) return { error: 'empty' };

  let config: unknown;
  try {
    config = flattenOldColors(JSON.parse(text));
  } catch (error) {
    return {
      error: 'invalid',
      messages: [error instanceof Error ? error.message : String(error)],
    };
  }

  const result = externalConfigSchema.safeParse(config);
  if (!result.success) {
    return {
      error: 'invalid',
      messages: result.error.issues.map((issue) =>
        issue.path.length > 0
          ? `${issue.path.join('.')}: ${issue.message}`
          : issue.message,
      ),
    };
  }

  // The config is kept as it was written, not as the schema transforms it, so that it is exported the same way
  const { themes, ...rest } = config as ExternalConfigSchemaInput;
  if (!themes || Object.keys(themes).length === 0)
    return { error: 'no-themes' };
  return { config: normalizeConfig({ ...rest, themes }) };
}
