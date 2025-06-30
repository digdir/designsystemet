import path from 'node:path';
import type { TransformedToken } from 'style-dictionary/types';
import config from '../../../theme/configs/designsystemet.config.json' with { type: 'json' };
import { generate$Themes } from '../tokens/create/generators/$themes.js';
import { createTokens } from '../tokens/create.js';
import { buildOptions, processPlatform } from '../tokens/process/platform.js';
import { processThemeObject } from '../tokens/process/utils/getMultidimensionalThemes.js';
import type { OutputFile, Theme } from '../tokens/types.js';
import { cleanDir, mkdir, writeFile } from '../utils.js';

async function write(files: OutputFile[], outDir: string, dry?: boolean) {
  for (const { destination, output } of files) {
    if (destination) {
      const filePath = path.join(outDir, destination);
      const fileDir = path.dirname(filePath);

      console.log(destination);

      await mkdir(fileDir, dry);
      await writeFile(filePath, output, dry);
    }
  }
}

const toPreviewToken = (tokens: { token: TransformedToken; formatted: string }[]): PreviewToken[] =>
  tokens.map(({ token, formatted }) => {
    const [variable, value] = formatted.split(':');
    return {
      description: token.$description || '',
      variable: variable.trim(),
      value: value.trim().replace(/;$/, ''), // Remove trailing semicolon if present
    };
  });

type PreviewToken = { variable: string; value: string };

export const formatTheme = async (themeConfig: Theme) => {
  const { tokenSets } = await createTokens(themeConfig);

  const $themes = await generate$Themes(['dark', 'light'], [themeConfig.name], themeConfig.colors);
  const processed$themes = $themes.map(processThemeObject);

  const processedBuilds = await processPlatform({
    type: 'format',
    tokenSets,
    processed$themes,
    verbose: false,
    buildTokenFormats: {},
  });

  await cleanDir('./temp/tokens', false);

  console.log(buildOptions?.buildTokenFormats ? 'Building token formats...' : 'No token formats to build.');

  const tokensGroupedByType: Record<string, PreviewToken[] | Record<string, PreviewToken[]>> = {};

  if (buildOptions?.buildTokenFormats) {
    for (const [destination, tokenFormats] of Object.entries(buildOptions.buildTokenFormats)) {
      console.log(`Processing token formats for ${destination}`);
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

    for (const [type, tokens] of Object.entries(tokensGroupedByType)) {
      write(
        [
          {
            destination: `../../../../apps/www/app/tokens/${type}.json`,
            output: JSON.stringify(tokens, null, 2),
          },
        ],
        './temp/tokens',
        false,
      );
    }

    return processedBuilds;
  }
};

formatTheme({
  name: 'test',
  borderRadius: config.themes.designsystemet.borderRadius,
  colors: {
    main: config.themes.designsystemet.colors.main as Record<string, `#${string}`>,
    support: config.themes.designsystemet.colors.support as Record<string, `#$string`>,
    neutral: config.themes.designsystemet.colors.neutral as `#$string`,
  },
  typography: config.themes.designsystemet.typography,
});
