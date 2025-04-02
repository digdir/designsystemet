import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import type { DesignToken } from 'style-dictionary/types';
import { cleanDir, mkdir, readFile, writeFile } from '../utils.js';
import { createThemeCSSFiles } from './format.js';
import { type BuildOptions, processPlatform } from './process/platform.js';

export const buildTokens = async (options: Omit<BuildOptions, 'process' | '$themes'>) => {
  const $themes = JSON.parse(await readFile(path.resolve(`${options.tokensDir}/$themes.json`))) as ThemeObject[];

  const resolvedOutDir = path.resolve(options.outDir);
  const processedBuilds = await processPlatform<DesignToken>({
    ...options,
    outDir: resolvedOutDir,
    tokensDir: path.resolve(options.tokensDir),
    process: 'build',
    $themes,
  });

  if (options.clean) {
    await cleanDir(resolvedOutDir, options.dry);
  }

  console.log(`\nWriting build to ${chalk.green(options.outDir)}`);

  for (const [_, buildResults] of Object.entries(processedBuilds)) {
    for (const { formatted: format } of buildResults) {
      for (const { destination, output } of format) {
        if (destination) {
          const fileDir = path.join(resolvedOutDir, path.dirname(destination));
          await mkdir(fileDir, options.dry);

          const filePath = path.join(resolvedOutDir, destination);
          await writeFile(filePath, output, options.dry);
        }
      }
    }
  }

  for (const { destination, output } of createThemeCSSFiles(processedBuilds)) {
    if (destination) {
      const filePath = path.join(resolvedOutDir, destination);
      await writeFile(filePath, output, options.dry);
    }
  }

  console.log(`\n✅ Finished building tokens!`);

  return processedBuilds;
};
