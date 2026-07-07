import {
  parseConfig,
  validateConfig,
} from '@digdir/designsystemet/schemas/helpers.js';
import { defaultTheme } from '@digdir/designsystemet/schemas/v1.1/defaults.js';
import { configFileCreateSchema } from '@digdir/designsystemet/schemas/v1.1/schema.js';
import {
  createSystemTokens,
  createTokens,
  type ThemeObject_,
  tokenSetDimensions,
} from '@digdir/designsystemet/tokens/create';
import type { Theme, TokenSets } from '@digdir/designsystemet/tokens/types';
import type { infer as ZodInfer } from 'zod';
import type { FigmaMessages } from '../types';

// Use a Map so that token sets shared across themes (e.g. semantic/color) are only
// kept once. Theme-specific sets have unique paths (themes/some-org, etc.) and are
// kept as-is; shared sets are identical across themes so overwriting is safe.
const _tokenSets: Map<string, TokenSets> = new Map<string, TokenSets>();

// Color names are derived from the generated `semantic/color/<name>` token sets so
// the auto-generated severity colors (danger, info, success, warning) are included
// alongside the user-defined colors and neutral.
const semanticColorNames = new Set<string>();

let _$themes: ThemeObject_[] = [];

type ConfigSchema = ZodInfer<typeof configFileCreateSchema>;

if (figma.editorType === 'figma') {
  figma.showUI(__html__, {
    width: 800,
    height: 650,
    title: 'Designsystemet',
    themeColors: true,
  });
}

figma.ui.onmessage = async (msg: FigmaMessages) => {
  switch (msg.type) {
    case 'import-config': {
      try {
        const parsedConfig = parseConfig<ConfigSchema>(msg.config);

        const config = validateConfig<ConfigSchema>(
          configFileCreateSchema,
          parsedConfig,
        );

        const themeNames = Object.keys(config.themes ?? {});

        for (const [themeName, themeConfig] of Object.entries(
          config.themes,
        ) as [string, ConfigSchema['themes'][string]][]) {
          const mergedTheme: Theme = {
            ...defaultTheme,
            name: themeName,
            ...themeConfig,
          };

          console.log(
            `Creating tokens for theme "${themeName}"...`,
            mergedTheme,
          );

          const { tokenSets } = await createTokens(mergedTheme);

          _tokenSets.set(themeName, tokenSets);

          // Collect semantic color names from the token set paths to get severity colors, neutral and other default colors. These will be used to generate system tokens later.
          for (const [tokenSetPath] of tokenSets.entries()) {
            const colorMatch = /^semantic\/color\/(.+)$/.exec(tokenSetPath);
            if (colorMatch) {
              semanticColorNames.add(colorMatch[1]);
            }
          }

          figma.ui.postMessage({
            type: 'import-config-result',
            status: 'success',
            message: `Imported ${_tokenSets.size} token sets for theme "${themeName}".`,
          });
        }

        const systemTokensOptions = {
          tokenSetDimensions,
          colorNames: Array.from(semanticColorNames),
          themeNames,
        };

        console.log(
          'Creating system tokens with options:',
          systemTokensOptions,
        );
        const systemTokens = await createSystemTokens(systemTokensOptions);

        // This will be used later for exporting tokens to Figma variables
        _$themes = systemTokens.$themes;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        figma.ui.postMessage({
          type: 'import-config-result',
          status: 'error',
          message: `Error importing tokens: ${errorMessage}`,
        });
        console.error('Error importing tokens:', error);
      }

      break;
    }
    case 'export-tokens-to-figma': {
      try {
        figma.ui.postMessage({
          type: 'export-tokens-to-figma-result',
          status: 'finished',
          message: 'Exported tokens to Figma variables successfully.',
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        figma.ui.postMessage({
          type: 'export-tokens-to-figma-result',
          status: 'error',
          message: `Error exporting tokens: ${errorMessage}`,
        });
        console.error('Error exporting tokens:', error);
      }

      break;
    }
  }
};
