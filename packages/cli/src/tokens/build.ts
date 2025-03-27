import type { DesignToken } from 'style-dictionary/types';
import { type BuildOptions, processPlatform } from './process/platform.js';

export const buildTokens = async (options: Omit<BuildOptions, 'process'>) => {
  const tokens = await processPlatform<DesignToken>({
    process: 'build',
    ...options,
  });

  return tokens;
};
