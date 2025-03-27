import { type FormatOptions, processPlatform } from './process/platform.js';

export type FormattedToken = {
  output: string;
  destination: string | undefined;
};

export const formatTokens = async (options: Omit<FormatOptions, 'process'>) => {
  const tokens = await processPlatform<FormattedToken>({
    process: 'format',
    ...options,
  });

  return tokens;
};
