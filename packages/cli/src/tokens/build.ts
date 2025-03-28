import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import type { DesignToken } from 'style-dictionary/types';
import { readFile } from '../utils.js';
import { type BuildOptions, processPlatform } from './process/platform.js';

export const buildTokens = async (options: Omit<BuildOptions, 'process' | '$themes'>) => {
  const $themes = JSON.parse(await readFile(path.resolve(`${options.tokensDir}/$themes.json`))) as ThemeObject[];

  const tokens = await processPlatform<DesignToken>({
    ...options,
    process: 'build',
    $themes,
  });

  return tokens;
};
