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

const hexPatterns = [
  // Hex colors: #000, #0000, #000000, #00000000
  `#[0-9a-fA-F]{3}`,
  `#[0-9a-fA-F]{4}`,
  `#[0-9a-fA-F]{6}`,
  `#[0-9a-fA-F]{8}`,
];

export const colorRegex = new RegExp(`^${hexPatterns.join('|')}$`);

const colorSchema = z
  .string({ description: 'A hex color, which is used for creating a color scale' })
  .regex(colorRegex)
  .transform(convertToHex);
const colorCategorySchema = z.record(colorSchema, { description: 'One or more color definitions' });

const themeSchema = z.object(
  {
    colors: z.object(
      {
        main: colorCategorySchema,
        support: colorCategorySchema,
        neutral: colorSchema,
      },
      { description: 'Defines the colors for this theme' },
    ),
    typography: z.object(
      {
        fontFamily: z.string({ description: 'Sets the font-family for this theme' }),
      },
      { description: 'Defines the typography for a given theme' },
    ),
    borderRadius: z.number({ description: 'Defines the border-radius for this theme' }),
  },
  { description: 'An object defining a theme. The property name holding the object becomes the theme name.' },
);

/**
 * This defines the structure of the JSON config file
 */
export const configFileSchema = z.object({
  outDir: z.string({ description: 'Path to the output directory for the created design tokens' }).optional(),
  themes: z.record(themeSchema, {
    description:
      'An object with one or more themes. Each property defines a theme, and the property name is used as the theme name.',
  }),
});

/**
 * This defines the structure of the final configuration after combining the config file,
 * command-line options and default values.
 */
export const combinedConfigSchema = configFileSchema.required();
export type CombinedConfigSchema = z.infer<typeof combinedConfigSchema>;
