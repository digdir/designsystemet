import {
  parseConfig,
  validateConfig,
} from '@digdir/designsystemet/schemas/helpers.js';
import { configFileCreateSchema } from '@digdir/designsystemet/schemas/v1.1/schema.js';
import {
  createSystemTokens,
  createTokens,
  tokenSetDimensions,
} from '@digdir/designsystemet/tokens/create';
import type { infer as ZodInfer } from 'zod';
import { postMessage } from '../common';
import type { FigmaMessages } from '../types';
import { importToFigma } from './token-export/importer';
import { buildPreview } from './token-export/preview-model';
import type { LoadedFile } from './token-export/types';

function makeLoadedFile(path: string, data: unknown): LoadedFile {
  return {
    path,
    tokenSetPath: path.replace(/\.jsonc?$/i, ''),
    data,
  };
}

// Use a Map so that token sets shared across themes (e.g. semantic/color) are only
// kept once. Theme-specific sets have unique paths (themes/some-org, etc.) and are
// kept as-is; shared sets are identical across themes so overwriting is safe.
const fileMap = new Map<string, LoadedFile>();
let files: LoadedFile[] = [];
let previewData: ReturnType<typeof buildPreview> | null = null;

// Color names are derived from the generated `semantic/color/<name>` token sets so
// the auto-generated severity colors (danger, info, success, warning) are included
// alongside the user-defined colors and neutral.
const semanticColorNames = new Set<string>();

let themeNames: string[] = [];

type ConfigSchema = ZodInfer<typeof configFileCreateSchema>;

if (figma.editorType === 'figma') {
  figma.showUI(__html__, {
    width: 800,
    height: 700,
    title: 'Designsystemet',
    themeColors: true,
  });
}

figma.ui.onmessage = async (msg: FigmaMessages) => {
  switch (msg.type) {
    case 'import-config-and-create-preview-tokens': {
      try {
        semanticColorNames.clear();
        fileMap.clear();
        files = [];

        const parsedConfig = parseConfig<ConfigSchema>(msg.config);

        const config = validateConfig<ConfigSchema>(
          configFileCreateSchema,
          parsedConfig,
        );

        themeNames = Object.keys(config.themes ?? {});

        for (const [themeName, themeConfig] of Object.entries(
          config.themes,
        ) as [string, ConfigSchema['themes'][string]][]) {
          const { tokenSets } = await createTokens({
            name: themeName,
            ...themeConfig,
          });

          // Collect semantic color names from the token set paths to get severity colors, neutral and other default colors. These will be used to generate system tokens later.
          for (const [tokenSetPath, data] of tokenSets.entries()) {
            const file = makeLoadedFile(`${tokenSetPath}.json`, data);
            fileMap.set(file.tokenSetPath, file);

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

        const systemTokens = await createSystemTokens(systemTokensOptions);

        files = Array.from(fileMap.values());
        files.push(makeLoadedFile('$themes.json', systemTokens.$themes));
        files.sort((a, b) => a.path.localeCompare(b.path));

        previewData = buildPreview(files);
        postMessage('preview-tokens-from-config', {
          status: 'success',
          preview: {
            previewData,
            colorNames: Array.from(semanticColorNames),
            themeNames,
          },
          message: `Imported ${files.length} token sets from ${themeNames.length} themes.`,
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
    case 'export-tokens-to-figma': {
      try {
        postMessage('export-tokens-to-figma', {
          status: 'exporting',
          message: 'Starting export of tokens to Figma variables...',
        });

        if (!previewData) {
          throw new Error('No preview data available for export.');
        }

        const result = await importToFigma({
          preview: previewData,
          selectedTheme: themeNames.length > 0 ? themeNames[0] : null,
          selectedScheme: 'light',
        });
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
  }
};
