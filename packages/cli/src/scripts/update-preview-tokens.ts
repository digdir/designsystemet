import path from 'node:path';
import pc from 'picocolors';
import type { TransformedToken } from 'style-dictionary/types';
import config from './../../../../designsystemet.config.json' with { type: 'json' };
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

      console.log(`Writing file: ${pc.green(filePath)}`);

      await mkdir(fileDir, dry);
      await writeFile(filePath, output, dry);
    }
  }
}

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
  const { tokenSets, themeDimensions } = await createTokens(themeConfig);
  const outDir = '../../apps/www/app/_components/tokens/design-tokens';

  const $themes = await generate$Themes(
    { ...themeDimensions, fontNamesPerTheme: { [themeConfig.name]: themeDimensions.fontNames } },
    [themeConfig.name],
    themeConfig.colors,
  );
  const processed$themes = $themes.map(processThemeObject);

  // We run this to populate the `buildOptions.buildTokenFormats` with transformed tokens
  await processPlatform({
    type: 'format',
    tokenSets,
    processed$themes,
    verbose: false,
    buildTokenFormats: {},
  });

  await cleanDir(outDir, false);

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
      write(
        [
          {
            destination: `${type}.json`,
            output: JSON.stringify(tokens, null, 2),
          },
        ],
        outDir,
        false,
      );
    }
    console.log(`\n✅ Finished building preview tokens for ${pc.blue('Designsystemet')}`);
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
