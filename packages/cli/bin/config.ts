import * as R from 'ramda';
import { z } from 'zod';
import { convertToHex } from '../src/colors/index.js';
import { cliOptions } from '../src/tokens/create.js';

export function mapPathToOptionName(path: (string | number)[]) {
  // replace "themes.some-theme-name" with "theme" to match cliOptions object
  const normalisedPath = path[0] === 'themes' ? ['theme', ...R.drop(2, path)] : path;
  const option = R.path(normalisedPath, cliOptions);
  if (typeof option !== 'string') {
    return;
  }
  return option;
}

const themeSchema = z.object({
  colors: z.object({
    main: z.record(z.string().transform(convertToHex)),
    support: z.record(z.string().transform(convertToHex)),
    neutral: z.string().transform(convertToHex),
  }),
  typography: z.object({
    fontFamily: z.string(),
  }),
  borderRadius: z.number(),
});

/**
 * This defines the structure of the JSON config file
 */
export const configFileSchema = z.object({
  outDir: z.string().optional(),
  themes: z.record(themeSchema),
});

/**
 * This defines the structure of the final configuration after combining the config file,
 * command-line options and default values.
 */
export const combinedConfigSchema = configFileSchema.required();
export type CombinedConfigSchema = z.infer<typeof combinedConfigSchema>;
