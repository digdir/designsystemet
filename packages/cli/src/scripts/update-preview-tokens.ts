import { log } from 'node:console';
import path from 'node:path';
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
    preview: true,
  });

  await cleanDir('./temp/tokens', false);

  console.log(buildOptions?.buildTokenFormats ? 'Building token formats...' : 'No token formats to build.');

  if (buildOptions?.buildTokenFormats) {
    for (const [destination, tokenFormats] of Object.entries(buildOptions.buildTokenFormats)) {
      log(`Processing token formats for ${destination}`);
      const tokens = tokenFormats.map(([token, _]) => token);
      const filename = `${destination.replace('.css', '')}.json`;

      console.log(`Writing tokens to ${filename}`);

      const tokenFiles = {
        destination: `./temp/tokens/${filename}`,
        output: JSON.stringify(tokens, null, 2),
      };
      await write([tokenFiles], './temp/tokens', false);
    }
  }

  return processedBuilds;
};

formatTheme({
  name: 'test',
  borderRadius: config.themes['designsystemet'].borderRadius,
  colors: {
    main: config.themes['designsystemet'].colors.main as Record<string, `#${string}`>,
    support: config.themes['designsystemet'].colors.support as Record<string, `#${string}`>,
    neutral: config.themes['designsystemet'].colors.neutral as `#${string}`,
  },
  typography: config.themes['designsystemet'].typography,
});
