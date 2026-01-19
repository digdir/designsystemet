import pc from 'picocolors';
import * as R from 'ramda';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { baseColorNames, colorNames } from './colors/colorMetadata.js';
import { convertToHex } from './colors/index.js';
import { RESERVED_COLORS } from './colors/theme.js';
import { cliOptions } from './tokens/create.js';

function mapPathToOptionName(path: PropertyKey[]) {
  // replace "themes.some-theme-name" with "theme" to match cliOptions object
  const normalisedPath = path[0] === 'themes' ? ['theme', ...R.drop(2, path)] : path;
  const option = R.path(normalisedPath as Array<string | number>, cliOptions);
  if (typeof option !== 'string') {
    return;
  }
  return option;
}

function makeFriendlyError(err: unknown) {
  try {
    return fromError(err, {
      messageBuilder: (issues) =>
        issues
          .map((issue) => {
            const issuePath = issue.path.join('.');
            const optionName = mapPathToOptionName(issue.path);

            const errorCode = `(error code: ${issue.code})`;
            const optionMessage = optionName ? ` or CLI option --${optionName}` : '';
            return `  - Error in JSON value ${pc.red(issuePath)}${optionMessage}:
      ${issue.message} ${pc.dim(errorCode)}`;
          })
          .join('\n'),
    });
  } catch (_err2) {
    console.error(pc.red(err instanceof Error ? err.message : 'Unknown error occurred while parsing config file'));
    console.error(err instanceof Error ? err.stack : 'No stack trace available');
  }
}

/**
 * Validates a configuration object against a provided Zod schema.
 *
 * @template T - The expected type of the validated configuration.
 * @param schema - A Zod schema used to validate the configuration object.
 * @param unvalidatedConfig - The configuration object to validate.
 * @returns The validated configuration object, typed as T.
 * @throws Exits the process with code 1 if validation fails, after logging a friendly error message.
 */
export function validateConfig<T>(
  schema: z.ZodType<T>,
  unvalidatedConfig: Record<string, unknown>,
  configPath: string,
): T {
  try {
    return schema.parse(unvalidatedConfig) as T;
  } catch (err) {
    console.error(pc.redBright(`Invalid config file at ${pc.red(configPath)}`));

    const validationError = makeFriendlyError(err);
    console.error(validationError?.toString());
    process.exit(1);
  }
}

export function parseConfig<T>(configFile: string, configPath: string): T {
  if (!configFile) {
    return {} as T;
  }

  try {
    return JSON.parse(configFile) as T;
  } catch (err) {
    console.error(pc.redBright(`Failed parsing config file at ${pc.red(configPath)}`));

    const validationError = makeFriendlyError(err);
    console.error(validationError?.toString());

    process.exit(1);
  }
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

const colorModeOverrideSchema = z
  .object({
    light: colorSchema.optional().describe('A hex color that overrides light mode'),
    dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
  })
  .describe('Override values for semantic color tokens like "background-subtle", "border-default", etc.');

const colorWeightOverrideSchema = z
  .partialRecord(z.enum([...colorNames]), colorModeOverrideSchema)
  .describe('The name of the color to add overrides for, e.g. "accent"');

const semanticColorOverrideSchema = z
  .record(z.string(), colorWeightOverrideSchema)
  .describe('An object with color names as keys');

const severityColorOverrideSchema = z
  .partialRecord(z.enum(baseColorNames), colorSchema.describe('A hex color, which is used for creating a color scale'))
  .optional()
  .describe('An object with severity color names as keys');

const linkVisitedOverrideSchema = z
  .object({
    light: colorSchema.optional().describe('A hex color that overrides light mode'),
    dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
  })
  .describe('Overrides for the "link-visited" color');

const focusOverrideSchema = z
  .object({
    inner: z
      .object({
        light: colorSchema.optional().describe('A hex color that overrides light mode'),
        dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
      })
      .optional()
      .describe('Overrides for the "focus-inner" color'),
    outer: z
      .object({
        light: colorSchema.optional().describe('A hex color that overrides light mode'),
        dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
      })
      .optional()
      .describe('Overrides for the "focus-outer" color'),
  })
  .describe('Overrides for the focus colors');

const fontSizeSteps = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;
const fontSizeStepOverrideSchema = z
  .number()
  .describe('Number in pixels to use as a font size for this step in the scale');
const fontSizeOverrides = z.partialRecord(z.enum(fontSizeSteps), fontSizeStepOverrideSchema);

const fontSizeMode = z.object({
  base: z
    .number()
    .optional()
    .describe('The font size (in px) to use as the basis for the scale. Is used as font-size.4.'),
  ratio: z
    .number()
    .optional()
    .describe(
      'The ratio used to calculate each step in the scale. Must be larger than 1 (a ratio of 1 would make all font sizes the same, while a number between 0 and 1 effectively inverts the scale). Larger numbers result in a larger font-size.10 and a smaller font-size.1.',
    ),
  overrides: fontSizeOverrides
    .optional()
    .describe(
      'Override one or more steps in this scale to specific pixel values. Will force build.typographySizeValues to be "static".',
    ),
});
const typographySizeModes = z.partialRecord(z.enum(['small', 'medium', 'large']), fontSizeMode);

const typographySizeSchema = z.object({
  modes: typographySizeModes.optional(),
});

const overridesSchema = z
  .object({
    colors: semanticColorOverrideSchema.optional(),
    severity: severityColorOverrideSchema.optional(),
    linkVisited: linkVisitedOverrideSchema.optional(),
    focus: focusOverrideSchema.optional(),
  })
  .describe('Overrides for generated design tokens. Currently only supports colors defined in your theme')
  .optional();

const themeSchema = z
  .object({
    colors: z
      .object({
        main: colorCategorySchema,
        support: colorCategorySchema.optional().default({}),
        neutral: colorSchema.describe('A hex color, which is used for creating a color scale.'),
      })
      .meta({ description: 'Defines the colors for this theme' }),
    typography: z
      .object({
        fontFamily: z.string().meta({ description: 'Sets the font-family for this theme' }),
      })
      .describe('Defines the typography for a given theme')
      .optional(),
    borderRadius: z.number().meta({ description: 'Defines the border-radius for this theme' }).optional(),
    overrides: overridesSchema,
  })
  .meta({ description: 'An object defining a theme. The property name holding the object becomes the theme name.' });

const commonConfig = z.object({
  clean: z.boolean().meta({ description: 'Delete the output directory before building or creating tokens' }).optional(),
});

const _configFileCreateSchema = z.object({
  outDir: z.string().meta({ description: 'Path to the output directory for the created design tokens' }),
  themes: z.record(z.string(), themeSchema).meta({
    description:
      'An object with one or more themes. Each property defines a theme, and the property name is used as the theme name.',
  }),
  globalTypography: z
    .object({
      size: typographySizeSchema.optional(),
    })
    .optional()
    .describe('Global typography settings that apply to all themes'),
});

const _configFileBuildSchema = z.object({
  build: z
    .object({
      typographySizeValues: z
        .enum(['modular', 'static'])
        .optional()
        .describe(
          'Changes how CSS values are generated. "modular" is the default, and will output css formulae which can be changed using --ds-font-scale-base and --ds-font-scale-ratio in code. "static" will output static values for each size mode. If you have overridden any steps in the font size scales with specific values, "static" will always be used.',
        ),
    })
    .optional()
    .describe('Options that only affect build'),
});

export const configFileCreateSchema = _configFileCreateSchema.extend(commonConfig.shape);
export const configFileBuildSchema = _configFileBuildSchema.extend(commonConfig.shape);
/**
 * This defines the structure of the final configuration file
 */
export const configFileSchema = configFileCreateSchema.extend(configFileBuildSchema.shape);
export type CommonConfigSchema = z.infer<typeof commonConfig>;
export type BuildConfigSchema = z.infer<typeof configFileBuildSchema>;
export type CreateConfigSchema = z.infer<typeof configFileCreateSchema>;
export type ConfigSchemaTheme = z.infer<typeof themeSchema>;
export type ColorOverrideSchema = z.infer<typeof overridesSchema>;
export type TypographySizeSchema = z.infer<typeof typographySizeSchema>;
