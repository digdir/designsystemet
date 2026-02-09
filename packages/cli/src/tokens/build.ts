import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import pc from 'picocolors';
import * as R from 'ramda';
import fs from '../utils/filesystem.js';
import { createTypeDeclarationFiles } from './process/output/declarations.js';
import { createTailwindCSSFiles } from './process/output/tailwind.js';
import { createThemeCSSFiles, defaultFileHeader } from './process/output/theme.js';
import { type BuildOptions, processPlatform } from './process/platform.js';
import { processThemeObject } from './process/utils/getMultidimensionalThemes.js';
import type { DesignsystemetObject, OutputFile } from './types.js';

async function write(files: OutputFile[], outDir: string) {
  for (const { destination, output } of files) {
    if (destination) {
      const filePath = path.join(outDir, destination);
      const fileDir = path.dirname(filePath);

      console.log(destination);

      await fs.mkdir(fileDir);
      await fs.writeFile(filePath, output);
    }
  }
}

export const buildTokens = async (options: Omit<BuildOptions, 'type' | 'processed$themes' | 'buildTokenFormats'>) => {
  const outDir = path.resolve(options.outDir);
  const tokensDir = path.resolve(options.tokensDir);
  const $themes = JSON.parse(await fs.readFile(`${tokensDir}/$themes.json`)) as ThemeObject[];
  const processed$themes = $themes.map(processThemeObject);
  let $designsystemet: DesignsystemetObject | undefined;

  try {
    const $designsystemetContent = await fs.readFile(`${tokensDir}/$designsystemet.jsonc`);
    $designsystemet = JSON.parse($designsystemetContent) as DesignsystemetObject;
  } catch (_error) {}

  console.log(`\n🏗️ Start building tokens in ${pc.green(tokensDir)}`);

  const processedBuilds = await processPlatform({
    ...options,
    outDir: outDir,
    tokensDir: tokensDir,
    type: 'build',
    processed$themes,
    buildTokenFormats: {},
  });

  const fileHeader = R.join('')([
    defaultFileHeader,
    $designsystemet ? `\ndesign-tokens: v${$designsystemet.version}` : '',
  ]);

  let files: OutputFile[] = [];

  const declarationFiles = createTypeDeclarationFiles(processed$themes);
  const cssFiles = createThemeCSSFiles({ processedBuilds, fileHeader });

  files = [...declarationFiles, ...cssFiles];

  if (options.tailwind) {
    const tailwindFiles = createTailwindCSSFiles(cssFiles);
    files = files.concat(tailwindFiles.filter(Boolean) as OutputFile[]);
  }

  console.log(`\n💾 Writing build to ${pc.green(outDir)}`);

  await write(files, outDir);

  console.log(`\n✅ Finished building tokens!`);
  return processedBuilds;
};
