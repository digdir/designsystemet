import {
  parseConfig,
  validateConfig,
} from '@digdir/designsystemet/schemas/helpers.js';
import {
  type ConfigSchema,
  configSchema,
  externalConfigSchema,
} from '@digdir/designsystemet/schemas/schema.js';
import {
  createSystemTokens,
  createTokens,
  getTokenSetDimensions,
} from '@digdir/designsystemet/tokens/create';
import type { TokenSets } from '@digdir/designsystemet/tokens/types';
import { postMessage } from '../common';
import type { FigmaMessages } from '../types';
import { importToFigma } from './token-export/importer';
import { buildTokenModel } from './token-export/preview-model';
import type { TokenModel } from './token-export/types';

// Token sets from every theme, keyed by token set path. Shared sets (e.g.
// semantic/color) are identical across themes, so overwriting them is safe;
// theme-specific sets have unique paths (themes/some-org, etc.).
const tokenSets: TokenSets = new Map();
// Export-side model. The UI never sees it; it previews from the validated config.
let tokenModel: TokenModel | null = null;

// Color names are derived from the generated `semantic/color/<name>` token sets so
// the auto-generated severity colors (danger, info, success, warning) are included
// alongside the user-defined colors and neutral.
const semanticColorNames = new Set<string>();

let themeNames: string[] = [];

if (figma.editorType === 'figma') {
  figma.showUI(__html__, {
    width: 900,
    height: 800,
    title: 'Designsystemet',
    themeColors: true,
  });
}

figma.ui.onmessage = async (msg: FigmaMessages) => {
  switch (msg.type) {
    case 'import-config-and-create-preview-tokens': {
      try {
        semanticColorNames.clear();
        tokenSets.clear();

        const parsedConfig = parseConfig<ConfigSchema>(msg.config);

        // Validate the config against the public/external schema first, so configs using non-exposed
        // fields are rejected with a user-facing error. The normalized result (shorthands expanded,
        // public defaults applied) is then passed on to the full schema, which fills in the internal defaults.
        const externalConfig = validateConfig(
          externalConfigSchema,
          parsedConfig,
        );

        // Populate internal defaults from the sanitized public configuration.
        const config = validateConfig<ConfigSchema>(
          configSchema,
          externalConfig,
        );

        themeNames = Object.keys(config.themes ?? {});

        // The dimensions come from the first theme, mirroring the CLI: size modes and
        // typography sets are expected to be the same across themes.
        const tokenSetDimensions = getTokenSetDimensions(
          config.themes[themeNames[0]],
        );

        for (const [themeName, themeConfig] of Object.entries(
          config.themes,
        ) as [string, ConfigSchema['themes'][string]][]) {
          const themeTokens = await createTokens(
            {
              name: themeName,
              ...themeConfig,
            },
            tokenSetDimensions,
          );

          // Collect semantic color names from the token set paths to get severity colors, neutral and other default colors. These will be used to generate system tokens later.
          for (const [tokenSetPath, tokenSet] of themeTokens.tokenSets) {
            tokenSets.set(tokenSetPath, tokenSet);

            const colorMatch = /^semantic\/color\/(.+)$/.exec(tokenSetPath);
            if (colorMatch) {
              semanticColorNames.add(colorMatch[1]);
            }
          }
        }

        const systemTokensOptions = {
          tokenSetDimensions,
          colorNames: Array.from(semanticColorNames),
          themeNames,
        };

        const { $themes } = await createSystemTokens(systemTokensOptions);

        tokenModel = buildTokenModel({
          // Sorted by path so the model is stable regardless of theme order.
          tokenSets: new Map(
            Array.from(tokenSets).sort(([a], [b]) => a.localeCompare(b)),
          ),
          $themes,
        });
        postMessage('preview-tokens-from-config', {
          status: 'success',
          preview: { config, warnings: tokenModel.warnings },
          message: `Imported ${tokenSets.size} token sets from ${themeNames.length} themes.`,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        postMessage('preview-tokens-from-config', {
          status: 'error',
          message: `Error importing tokens: ${errorMessage}`,
        });

        console.error('Error importing tokens:', error);
      }

      break;
    }
    case 'export-tokens-to-figma':
      try {
        postMessage('export-tokens-to-figma', {
          status: 'exporting',
          message: 'Starting export of tokens to Figma variables...',
        });

        if (!tokenModel) {
          throw new Error('No token model available for export.');
        }

        const result = await importToFigma(tokenModel);
        postMessage('export-tokens-to-figma', {
          status: 'success',
          message: 'Exported tokens to Figma variables successfully.',
          logs: result.logs,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        postMessage('export-tokens-to-figma', {
          status: 'error',
          message: `Error exporting tokens: ${errorMessage}`,
        });
        console.error('Error exporting tokens:', error);
      }

      break;
  }
};
