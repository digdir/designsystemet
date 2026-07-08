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
import type { Theme } from '@digdir/designsystemet/tokens/types';
import type { infer as ZodInfer } from 'zod';
import type { FigmaMessages } from '../types';
import { importToFigma } from './token-export/importer';
import { buildPreview } from './token-export/preview-model';
import type { LoadedFile } from './token-export/types';

function makeLoadedFile(path: string, data: unknown): LoadedFile {
  return {
    path,
    tokenSetPath: path.replace(/\.jsonc?$/i, ''),
    size: JSON.stringify(data).length,
    data,
  };
}

// Use a Map so that token sets shared across themes (e.g. semantic/color) are only
// kept once. Theme-specific sets have unique paths (themes/some-org, etc.) and are
// kept as-is; shared sets are identical across themes so overwriting is safe.
const fileMap = new Map<string, LoadedFile>();
let files: LoadedFile[] = [];

// Color names are derived from the generated `semantic/color/<name>` token sets so
// the auto-generated severity colors (danger, info, success, warning) are included
// alongside the user-defined colors and neutral.
const semanticColorNames = new Set<string>();

let _$themes: ThemeObject_[] = [];

let themeNames: string[] = [];

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

        themeNames = Object.keys(config.themes ?? {});

        for (const [themeName, themeConfig] of Object.entries(
          config.themes,
        ) as [string, ConfigSchema['themes'][string]][]) {
          const mergedTheme: Theme = {
            ...defaultTheme,
            name: themeName,
            ...themeConfig,
          };

          const { tokenSets } = await createTokens(mergedTheme);

          // Collect semantic color names from the token set paths to get severity colors, neutral and other default colors. These will be used to generate system tokens later.
          for (const [tokenSetPath, data] of tokenSets.entries()) {
            const file = makeLoadedFile(`${tokenSetPath}.json`, data);
            fileMap.set(file.tokenSetPath, file);

            const colorMatch = /^semantic\/color\/(.+)$/.exec(tokenSetPath);
            if (colorMatch) {
              semanticColorNames.add(colorMatch[1]);
            }
          }

          figma.ui.postMessage({
            type: 'import-config-result',
            status: 'success',
            message: `Imported ${fileMap.size} token sets for theme "${themeName}".`,
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

        files = Array.from(fileMap.values());
        files.push(makeLoadedFile('$themes.json', systemTokens.$themes));
        files.sort((a, b) => a.path.localeCompare(b.path));
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
        const previewData = buildPreview(files);
        figma.ui.postMessage({
          type: 'export-tokens-to-figma-result',
          status: 'exporting',

          message: `Starting export of ${themeNames[0]} token sets to Figma variables...`,
        });

        const result = await importToFigma({
          preview: previewData,
          selectedTheme: themeNames.length > 0 ? themeNames[0] : null,
          selectedScheme: 'light',
        });
        figma.ui.postMessage({
          type: 'export-tokens-to-figma-result',
          status: 'finished',
          message: 'Exported tokens to Figma variables successfully.',
          logs: result.logs,
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
