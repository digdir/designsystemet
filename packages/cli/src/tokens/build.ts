import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import type { DesignToken } from 'style-dictionary/types';
import { cleanDir, mkdir, readFile, writeFile } from '../utils.js';
import { createThemeCSS } from './format.js';
import { type BuildOptions, processPlatform } from './process/platform.js';

export const buildTokens = async (options: Omit<BuildOptions, 'process' | '$themes'>) => {
  const $themes = JSON.parse(await readFile(path.resolve(`${options.tokensDir}/$themes.json`))) as ThemeObject[];

  const processedBuilds = await processPlatform<DesignToken>({
    ...options,
    outDir: path.resolve(options.outDir),
    tokensDir: path.resolve(options.tokensDir),
    process: 'build',
    $themes,
  });

  console.log();

  if (options.clean) {
    await cleanDir(options.outDir, options.dry);
  }

  console.log(`Writing build to ${chalk.green(options.outDir)}`);

  for (const [_, buildResults] of Object.entries(R.dissoc('types', processedBuilds))) {
    for (const { format } of buildResults) {
      for (const { destination, output } of format) {
        if (destination) {
          // TODO fix destination to be relative to outDir
          // Remove last part of the path to get the directory
          const targetDir = R.init(R.split('/', destination)).join('/');
          await mkdir(targetDir, options.dry);

          if (options.verbose) {
            console.log(`Writing ${chalk.blue(targetDir)}`);
          }
          writeFile(destination, output, options.dry);
        }
      }
    }
  }

  const types = R.head(R.head(processedBuilds.types)?.format ?? []);
  if (types?.destination) {
    await writeFile(path.resolve(`${options.outDir}/${types.destination}`), types?.output, options.dry);
  }

  const themeCSSFiles = createThemeCSS(processedBuilds);
  if (themeCSSFiles) {
    for (const { destination, output } of themeCSSFiles) {
      await writeFile(path.resolve(`${options.outDir}/${destination}`), output, options.dry);
    }
  }

  console.log(`✅ Finished building tokens!`);

  return processedBuilds;
};
