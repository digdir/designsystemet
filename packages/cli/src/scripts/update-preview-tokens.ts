import pc from 'picocolors';
import type { TransformedToken } from 'style-dictionary/types';
import config from './../../../../designsystemet.config.json' with { type: 'json' };
import { validateConfig } from '../schemas/helpers.ts';
import { nextConfigSchema } from '../schemas/next/schema.ts';
import { generate$Themes } from '../tokens/create/generators/$themes.ts';
import { createTokens, tokenSetDimensions } from '../tokens/create.ts';
import { buildOptions, processPlatform } from '../tokens/process/platform.ts';
import { processThemeObject } from '../tokens/process/utils/getMultidimensionalThemes.ts';
import type { Theme } from '../tokens/types.ts';
import { toColorNames } from '../tokens/utils.ts';
import { dsfs } from '../utils/filesystem.ts';

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

export const formatTheme = async (themeConfig: Theme) => {
  const colorNames = toColorNames(themeConfig.colors);
  const themeNames = [themeConfig.name];

  const { tokenSets } = await createTokens(themeConfig);
  const $themes = await generate$Themes(tokenSetDimensions, themeNames, colorNames);

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

// Parse the config through the schema so defaults (typography, borderRadius) are applied.
const { themes } = validateConfig(nextConfigSchema, config);

formatTheme({
  name: 'test',
  borderRadius: themes.designsystemet.borderRadius,
  colors: {
    primary: themes.designsystemet.colors.accent,
    neutral: themes.designsystemet.colors.neutral,
  },
  typography: themes.designsystemet.typography,
});
