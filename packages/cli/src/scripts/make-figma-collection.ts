import pc from 'picocolors';
import type { TransformedToken } from 'style-dictionary/types';
import config from './../../../../designsystemet.config.json' with { type: 'json' };
import { validateConfig } from '../schemas/helpers.ts';
import { type CreateConfigSchema, configSchema } from '../schemas/internal/schema.ts';
import { type FigmaCollections, toFigmaCollections } from '../tokens/create/figma-collections.ts';
import { generate$Themes } from '../tokens/create/generators/$themes.ts';
import { createTokens, getTokenSetDimensions } from '../tokens/create.ts';
import type { TokenSets } from '../tokens/types.ts';
import { toColorNames } from '../tokens/utils.ts';
import { dsfs } from '../utils/filesystem.ts';

const _toPreviewToken = (tokens: { token: TransformedToken; formatted: string }[]): PreviewToken[] =>
  tokens.map(({ token, formatted }) => {
    const [variable, value] = formatted.split(':');
    return {
      type: token.type,
      path: token.path,
      variable: variable.trim(),
      value: value.trim().replace(/;$/, ''), // Remove trailing semicolon if present
    };
  });

type PreviewToken = { variable: string; value: string };

/**
 * Builds a Figma collection for design-tokens from the provided configuration.
 * This function generates the necessary `$themes.json` file and processes the token sets for each theme.
 *
 * @param config - The configuration object containing theme definitions and token sets.
 * @param themeConfig
 */
const _toFigmaCollection = async (config: CreateConfigSchema) => {
  const themeNames = Object.keys(config.themes);

  console.log('config', config.themes);
  const colorNames = toColorNames(config.themes[themeNames[0]]?.colors); // All themes have the same color names, we take the first theme's colors

  // Dimensions come from the first theme, mirroring the CLI: size modes and typography sets
  // are expected to be the same across themes.
  const tokenSetDimensions = getTokenSetDimensions(config.themes[themeNames[0]]);

  // Token set keys are theme-qualified where they differ per theme (see createTokens), so all
  // themes can share one flat map — the shared sets (globals, size, semantic) are identical.
  const tokenSets: TokenSets = new Map();
  for (const [themeName, themeConfig] of Object.entries(config.themes)) {
    const { tokenSets: themeTokenSets } = await createTokens({ name: themeName, ...themeConfig }, tokenSetDimensions);
    for (const [key, set] of themeTokenSets) tokenSets.set(key, set);
  }

  const $themes = await generate$Themes(tokenSetDimensions, themeNames, colorNames);

  const figmaCollections: FigmaCollections = toFigmaCollections($themes, tokenSets, {
    onMissingTokenSet: (tokenSet, theme) =>
      console.warn(pc.yellow(`Token set "${tokenSet}" selected by ${theme.group}/${theme.name} was not generated`)),
  });

  dsfs.init({ outdir: 'temp' });
  dsfs.writeFiles(
    [
      {
        destination: `figma-collections.json`,
        output: JSON.stringify(figmaCollections, null, 2),
      },
    ],
    '../temp',
  );

  //   // We run this to populate the `buildOptions.buildTokenFormats` with transformed tokens
  //   await processPlatform({
  //     type: 'format',
  //     tokenSets,
  //     processed$themes,
  //     verbose: false,
  //     buildTokenFormats: {},
  //   });

  //   await dsfs.cleanDir(OUTDIR);

  //   console.log(
  //     buildOptions?.buildTokenFormats
  //       ? `\n🏗️ Start building preview tokens for ${pc.blue('Designsystemet')}\n`
  //       : '\n🚫 No token formats to build.',
  //   );

  //   const tokensGroupedByType: Record<string, PreviewToken[] | Record<string, PreviewToken[]>> = {};

  //   if (buildOptions?.buildTokenFormats) {
  //     for (const [destination, tokenFormats] of Object.entries(buildOptions.buildTokenFormats)) {
  //       if (destination === 'typography/secondary.css') continue; // Skip secondary typography preview tokens

  //       console.log(`Processing preview tokens for ${pc.green(destination)}`);

  //       const splits = destination.replace('.css', '').split('/');
  //       const [type, name] = splits;
  //       tokensGroupedByType[type] = tokensGroupedByType[type] === undefined ? {} : tokensGroupedByType[type];

  //       if (splits.length === 2) {
  //         if (typeof tokensGroupedByType[type] === 'object') {
  //           const current = Array.isArray(tokensGroupedByType[type]) ? (tokensGroupedByType[type] as PreviewToken[]) : [];
  //           (tokensGroupedByType[type] as Record<string, PreviewToken[]>)[name] = [
  //             ...current,
  //             ...toPreviewToken(tokenFormats),
  //           ];
  //         }
  //       }

  //       if (splits.length === 1) {
  //         // Ensure tokenTypes[type] is always an array before spreading
  //         const current = Array.isArray(tokensGroupedByType[type]) ? (tokensGroupedByType[type] as PreviewToken[]) : [];
  //         tokensGroupedByType[type] = [...current, ...toPreviewToken(tokenFormats)];
  //       }
  //     }

  console.log(`\n✅ Finished building preview tokens for ${pc.blue('Designsystemet')}`);
};

// Parse the config through the schema so defaults (typography, borderRadius) are applied.
const validatedConfig = validateConfig(configSchema, config);

_toFigmaCollection({ ...validatedConfig, outDir: '' });
