import { configFileCreateSchema } from '@digdir/designsystemet/schemas/v1.1/schema.js';
import { createTokens } from '@digdir/designsystemet/tokens/create';
import type { infer as ZodInfer } from 'zod';
import type { FigmaMessages } from '../types';

const GENERATED_ROOT = 'generated-design-tokens';
const DEFAULT_FONT_FAMILY = 'Inter';
const DEFAULT_BORDER_RADIUS = 4;

type LoadedFile = {
  path: string;
  tokenSetPath: string;
  size: number;
  data: unknown | null;
  error?: string;
};

function makeLoadedFile(path: string, data: unknown): LoadedFile {
  return {
    path: `${GENERATED_ROOT}/${path}`,
    tokenSetPath: path.replace(/\.jsonc?$/i, ''),
    size: JSON.stringify(data).length,
    data,
  };
}

// Use a Map so that token sets shared across themes (e.g. semantic/color) are only
// kept once. Theme-specific sets have unique paths (themes/some-org, etc.) and are
// kept as-is; shared sets are identical across themes so overwriting is safe.
const fileMap = new Map<string, LoadedFile>();

// Color names are derived from the generated `semantic/color/<name>` token sets so
// the auto-generated severity colors (danger, info, success, warning) are included
// alongside the user-defined colors and neutral.
const semanticColorNames = new Set<string>();

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
    case 'import-tokens': {
      try {
        const parsed = JSON.parse(msg.config);
        const config = configFileCreateSchema.parse(parsed) as ConfigSchema;

        for (const [themeName, themeConfig] of Object.entries(
          config.themes,
        ) as [string, ConfigSchema['themes'][string]][]) {
          const { tokenSets } = await createTokens({
            name: themeName,
            ...themeConfig,
            borderRadius: themeConfig.borderRadius ?? DEFAULT_BORDER_RADIUS,
            typography: {
              fontFamily:
                themeConfig.typography?.fontFamily ?? DEFAULT_FONT_FAMILY,
            },
          });

          for (const [tokenSetPath, data] of tokenSets.entries()) {
            const file = makeLoadedFile(`${tokenSetPath}.json`, data);
            fileMap.set(file.tokenSetPath, file);

            const colorMatch = /^semantic\/color\/(.+)$/.exec(tokenSetPath);
            if (colorMatch) {
              semanticColorNames.add(colorMatch[1]);
            }
          }
          figma.ui.postMessage({
            type: 'import-tokens',
            message: `Imported ${tokenSets.size} token sets for theme "${themeName}".`,
          });
          console.log(
            `Imported ${tokenSets.size} token sets for theme "${themeName}".`,
            Array.from(fileMap.entries()),
          );
        }
      } catch (error) {
        console.error('Error importing tokens:', error);
      }

      break;
    }
  }
};
