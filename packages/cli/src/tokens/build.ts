import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import type { DesignToken } from 'style-dictionary/types';
import { FileSystem } from '../utils.js';
import { createThemeCSSFiles } from './format.js';
import { type BuildOptions, processPlatform } from './process/platform.js';

export const buildTokens = async (options: Omit<BuildOptions, 'process' | '$themes'>) => {
  const fs = new FileSystem(options.dry);
  const $themes = JSON.parse(await fs.readFile(path.resolve(`${options.tokensDir}/$themes.json`))) as ThemeObject[];

  const resolvedOutDir = path.resolve(options.outDir);
  const processedBuilds = await processPlatform<DesignToken>({
    ...options,
    outDir: resolvedOutDir,
    tokensDir: path.resolve(options.tokensDir),
    process: 'build',
    $themes,
  });

  if (options.clean) {
    await fs.cleanDir(resolvedOutDir);
  }

  console.log(`\nWriting build to ${chalk.green(options.outDir)}`);

  // TODO https://github.com/digdir/designsystemet/issues/3434
  for (const [_, buildResults] of Object.entries(processedBuilds)) {
    for (const { formatted } of buildResults) {
      for (const { destination, output } of formatted) {
        if (destination) {
          const fileDir = path.join(resolvedOutDir, path.dirname(destination));
          await fs.mkdir(fileDir);

          const filePath = path.join(resolvedOutDir, destination);
          await fs.writeFile(filePath, output);
        }
      }
    }
  }

  for (const { destination, output } of createThemeCSSFiles(processedBuilds)) {
    if (destination) {
      const filePath = path.join(resolvedOutDir, destination);
      await fs.writeFile(filePath, output);
    }
  }

  console.log(`\n✅ Finished building tokens!`);
  return processedBuilds;
};
