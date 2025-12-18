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

export const commonConfig = z.object({
  clean: z.boolean().meta({ description: 'Delete the output directory before building or creating tokens' }).optional(),
});

const _configFileCreateSchema = z
  .object({
    outDir: z.string().meta({ description: 'Path to the output directory for the created design tokens' }),
    themes: z.record(z.string(), themeSchema).meta({
      description:
        'An object with one or more themes. Each property defines a theme, and the property name is used as the theme name.',
    }),
  })
  .required();

/**
 * This defines the structure of the final configuration file
 */
export const configFileCreateSchema = _configFileCreateSchema.extend(commonConfig.shape);
export type CommonConfigSchema = z.infer<typeof commonConfig>;
export type BuildConfigSchema = z.infer<typeof commonConfig>;
export type CreateConfigSchema = z.infer<typeof configFileCreateSchema>;
export type ConfigSchemaTheme = z.infer<typeof themeSchema>;
export type ColorOverrideSchema = z.infer<typeof overridesSchema>;
