import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import type { DesignToken } from 'style-dictionary/types';
import { mkdir, readFile, writeFile } from '../utils.js';
import { createThemeCSSFiles, defaultFileHeader } from './process/output/theme.js';

import { generateTailwind } from './process/output/create-tailwind-files.js';
import { type BuildOptions, processPlatform } from './process/platform.js';
import type { DesignsystemetObject, OutputFile } from './types.js';

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

export const buildTokens = async (options: Omit<BuildOptions, 'type' | '$themes'>) => {
  const outDir = path.resolve(options.outDir);
  const tokensDir = path.resolve(options.tokensDir);
  const $themes = JSON.parse(await readFile(`${tokensDir}/$themes.json`)) as ThemeObject[];
  let $designsystemet: DesignsystemetObject | undefined;

  try {
    const $designsystemetContent = await readFile(`${tokensDir}/$designsystemet.json`);
    $designsystemet = JSON.parse($designsystemetContent) as DesignsystemetObject;
  } catch (error) {}

  console.log(`\n🏗️ Start building tokens in ${chalk.green(tokensDir)}`);

  const processedBuilds = await processPlatform<DesignToken>({
    ...options,
    outDir: outDir,
    tokensDir: tokensDir,
    type: 'build',
    $themes,
  });

  // https://github.com/digdir/designsystemet/issues/3434
  // Disabled for now so that we can re-enable it later if needed (under a feature flag)
  // for (const [_, buildResults] of Object.entries(processedBuilds)) {
  //   for (const { formatted } of buildResults) {
  //     await write(formatted, resolvedOutDir, options.dry);
  //   }
  // }

  const fileHeader = R.join('')([
    defaultFileHeader,
    $designsystemet ? `\ndesign-tokens: v${$designsystemet.version}` : '',
  ]);

  let cssFiles = createThemeCSSFiles({ processedBuilds, fileHeader });
  if (options.tailwind) {
    console.log('\n🍱 Creating Tailwind Config');
    const tailwindFiles = cssFiles.map((file) => {
      if (file.destination) {
        const tailwindConfig = generateTailwind({ outDir, css: file.output });
        const tailwindFile = {
          destination: file.destination.replace('.css', '.tailwind.css'),
          output: tailwindConfig,
        };
        return tailwindFile;
      }
    });
    cssFiles = cssFiles.concat(tailwindFiles.filter(Boolean) as OutputFile[]);
  }

  console.log(`\n💾 Writing build to ${chalk.green(outDir)}`);

  // Write types (colors.d.ts) to the output directory
  for (const { formatted } of processedBuilds.types) {
    await write(formatted, outDir, options.dry);
  }

  // Write theme CSS files (<theme>.css) to the output directory
  await write(cssFiles, outDir, options.dry);

  console.log(`\n✅ Finished building tokens!`);
  return processedBuilds;
};
