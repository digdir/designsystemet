import {
  type ConfigSchema,
  configSchema,
  createSystemTokens,
  createTokens,
  externalConfigSchema,
  getTokenSetDimensions,
  parseConfig,
  type TokenSets,
  validateConfig,
} from '@digdir/designsystemet/internal';
import type { OnStep } from './import-to-figma';
import { buildTokenModel } from './token-model';
import type { TokenModel } from './types';

/**
 * Validates the pasted config and creates the token model to import. `onStep` is called before each of its 3 steps;
 * `onDetail` updates the current step's label, e.g. with the theme being created.
 */
export async function createTokenModel(
  configText: string,
  onStep: OnStep = async () => {},
  onDetail: (label: string) => void = () => {},
): Promise<TokenModel> {
  await onStep('Validating config');
  const parsedConfig = parseConfig<ConfigSchema>(configText);

  // Validate the config against the public/external schema first, so configs using non-exposed
  // fields are rejected with a user-facing error. The normalized result (shorthands expanded,
  // public defaults applied) is then passed on to the full schema, which fills in the internal defaults.
  const externalConfig = validateConfig(externalConfigSchema, parsedConfig);

  // Populate internal defaults from the sanitized public configuration.
  const config = validateConfig<ConfigSchema>(configSchema, externalConfig);

  // `themes` is optional in the config, but the plugin creates everything from themes.
  if (!config.themes || Object.keys(config.themes).length === 0) {
    throw new Error('The config must define at least one theme.');
  }

  const themes = Object.entries(config.themes);
  const themeNames = themes.map(([name]) => name);

  // The dimensions come from the first theme, mirroring the CLI: size modes and
  // typography sets are expected to be the same across themes.
  const tokenSetDimensions = getTokenSetDimensions(themes[0][1]);

  // Token sets from every theme, keyed by token set path. Shared sets (e.g.
  // semantic/color) are identical across themes, so overwriting them is safe;
  // theme-specific sets have unique paths (themes/some-org, etc.).
  const tokenSets: TokenSets = new Map();

  // Color names are derived from the generated `semantic/color/<name>` token sets so
  // the auto-generated severity colors (danger, info, success, warning) are included
  // alongside the user-defined colors and neutral.
  const semanticColorNames = new Set<string>();

  await onStep('Creating tokens');
  for (const [index, [themeName, themeConfig]] of themes.entries()) {
    onDetail(
      `Creating tokens for ${themeName} (${index + 1} of ${themes.length})`,
    );
    const themeTokens = await createTokens(
      { name: themeName, ...themeConfig },
      tokenSetDimensions,
    );

    for (const [tokenSetPath, tokenSet] of themeTokens.tokenSets) {
      tokenSets.set(tokenSetPath, tokenSet);

      const colorMatch = /^semantic\/color\/(.+)$/.exec(tokenSetPath);
      if (colorMatch) {
        semanticColorNames.add(colorMatch[1]);
      }
    }
  }

  await onStep('Preparing sync');
  const { $themes } = await createSystemTokens({
    tokenSetDimensions,
    colorNames: Array.from(semanticColorNames),
    themeNames,
  });

  return buildTokenModel({
    // Sorted by path so the model is stable regardless of theme order.
    tokenSets: new Map(
      Array.from(tokenSets).sort(([a], [b]) => a.localeCompare(b)),
    ),
    $themes,
  });
}
