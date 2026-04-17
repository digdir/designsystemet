import pc from 'picocolors';
import type { TransformedToken } from 'style-dictionary/types';
import config from './../../../../designsystemet.config.json' with { type: 'json' };
import { generate$Themes } from '../tokens/create/generators/$themes.js';
import { createTokens } from '../tokens/create.js';
import { buildOptions, processPlatform } from '../tokens/process/platform.js';
import { processThemeObject } from '../tokens/process/utils/getMultidimensionalThemes.js';
import type { ThemeConfig, TokenSetDimensionsForAllThemes } from '../tokens/types.js';
import { dsfs } from '../utils/filesystem.js';

const OUTDIR = '../../internal/components/src/tokens/design-tokens';

const toPreviewToken = (tokens: { token: TransformedToken; formatted: string }[]): PreviewToken[] =>
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

export const formatTheme = async (themeConfig: ThemeConfig) => {
  const { tokenSets, themeDimensions } = createTokens(themeConfig);

  const tokenSetDimensions: TokenSetDimensionsForAllThemes = {
    colorSchemes: themeDimensions.colorSchemes,
    sizeModes: themeDimensions.sizeModes,
    fontNamesPerTheme: { [themeConfig.name]: themeDimensions.fontNames },
    colorsPerTheme: { [themeConfig.name]: themeConfig.colors },
  };
  const $themes = await generate$Themes(tokenSetDimensions, [themeConfig.name]);
  const processed$themes = $themes.map(processThemeObject);

  // We run this to populate the `buildOptions.buildTokenFormats` with transformed tokens
  await processPlatform({
    type: 'format',
    tokenSets,
    processed$themes,
    verbose: false,
    buildTokenFormats: {},
  });

  await dsfs.cleanDir(OUTDIR);

  console.log(
    buildOptions?.buildTokenFormats
      ? `\n🏗️ Start building preview tokens for ${pc.blue('Designsystemet')}\n`
      : '\n🚫 No token formats to build.',
  );

  const tokensGroupedByType: Record<string, PreviewToken[] | Record<string, PreviewToken[]>> = {};

  if (buildOptions?.buildTokenFormats) {
    for (const [destination, tokenFormats] of Object.entries(buildOptions.buildTokenFormats)) {
      if (destination === 'typography/secondary.css') continue; // Skip secondary typography preview tokens

      console.log(`Processing preview tokens for ${pc.green(destination)}`);

      const splits = destination.replace('.css', '').split('/');
      const [type, name] = splits;
      tokensGroupedByType[type] = tokensGroupedByType[type] === undefined ? {} : tokensGroupedByType[type];

      if (splits.length === 2) {
        if (typeof tokensGroupedByType[type] === 'object') {
          const current = Array.isArray(tokensGroupedByType[type]) ? (tokensGroupedByType[type] as PreviewToken[]) : [];
          (tokensGroupedByType[type] as Record<string, PreviewToken[]>)[name] = [
            ...current,
            ...toPreviewToken(tokenFormats),
          ];
        }
      }

      if (splits.length === 1) {
        // Ensure tokenTypes[type] is always an array before spreading
        const current = Array.isArray(tokensGroupedByType[type]) ? (tokensGroupedByType[type] as PreviewToken[]) : [];
        tokensGroupedByType[type] = [...current, ...toPreviewToken(tokenFormats)];
      }
    }

    console.log(`\n💾 Writing preview tokens`);

    for (const [type, tokens] of Object.entries(tokensGroupedByType)) {
      dsfs.writeFiles(
        [
          {
            destination: `${type}.json`,
            output: JSON.stringify(tokens, null, 2),
          },
        ],
        OUTDIR,
      );
    }
    console.log(`\n✅ Finished building preview tokens for ${pc.blue('Designsystemet')}`);
  }
};

formatTheme({
  name: 'test',
  borderRadius: config.themes.designsystemet.borderRadius,
  colors: {
    main: {
      primary: config.themes.designsystemet.colors.main.accent as `#${string}`,
    },
    support: {},
    neutral: config.themes.designsystemet.colors.neutral as `#${string}`,
  },
  typography: config.themes.designsystemet.typography,
});
