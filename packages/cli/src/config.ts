import * as R from 'ramda';
import { z } from 'zod/v4';
import { convertToHex } from '../src/colors/index.js';
import { RESERVED_COLORS } from '../src/colors/theme.js';
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
const reservedColorsPattern = `^(?!(?:${RESERVED_COLORS.join('|')})$)`;

export const colorRegex = new RegExp(`^${hexPatterns.join('|')}$`);

const colorSchema = z
  .string()
  .regex(colorRegex)
  .transform(convertToHex)
  .describe(
    `A hex color, which is used for creating a color scale. Invalid color names: ${RESERVED_COLORS.join(', ')}`,
  );

const colorCategorySchema = z
  .record(
    z.string().regex(new RegExp(reservedColorsPattern, 'i'), {
      error: `Color names cannot include reserved names: ${RESERVED_COLORS.join(', ')}`,
    }),
    colorSchema,
    {
      error: 'Color definitions must be hex color values',
    },
  )
  .refine((colors) => !Object.keys(colors).some((key) => RESERVED_COLORS.includes(key.toLowerCase())), {
    error: `Color names cannot include reserved names: ${RESERVED_COLORS.join(', ')}`,
  })
  .describe('An object with one or more color definitions. The property name is used as the color name.');

const themeSchema = z
  .object({
    colors: z
      .object({
        main: colorCategorySchema,
        support: colorCategorySchema.optional().default({}),
        neutral: colorSchema,
      })
      .meta({ description: 'Defines the colors for this theme' }),
    typography: z
      .object({
        fontFamily: z.string().meta({ description: 'Sets the font-family for this theme' }),
      })
      .describe('Defines the typography for a given theme')
      .optional(),
    borderRadius: z.number().meta({ description: 'Defines the border-radius for this theme' }).optional(),
  })
  .meta({ description: 'An object defining a theme. The property name holding the object becomes the theme name.' });

/**
 * This defines the structure of the JSON config file
 */
export const configFileSchema = z.object({
  outDir: z.string().meta({ description: 'Path to the output directory for the created design tokens' }).optional(),
  clean: z.boolean().meta({ description: 'Delete the output directory before building or creating tokens' }).optional(),
  themes: z.record(z.string(), themeSchema).meta({
    description:
      'An object with one or more themes. Each property defines a theme, and the property name is used as the theme name.',
  }),
});

/**
 * This defines the structure of the final configuration after combining the config file,
 * command-line options and default values.
 */
export const combinedConfigSchema = configFileSchema.required();
export type Config = z.infer<typeof combinedConfigSchema>;
export type ThemeConfig = z.infer<typeof themeSchema>;
