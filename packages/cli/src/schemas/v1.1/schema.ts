import { z } from 'zod';
import { baseColorNames, colorNames } from '../../colors/colorMetadata.ts';
import { convertToHex } from '../../colors/index.ts';

const hexPatterns = [
  // Hex colors: #000, #0000, #000000, #00000000
  `#[0-9a-fA-F]{3}`,
  `#[0-9a-fA-F]{4}`,
  `#[0-9a-fA-F]{6}`,
  `#[0-9a-fA-F]{8}`,
];

export const colorRegex = new RegExp(`^${hexPatterns.join('|')}$`);

const colorSchema = z
  .string()
  .regex(colorRegex)
  .transform(convertToHex)
  .describe(`A hex color, which is used for creating a color scale.`);

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
      .record(z.string(), colorSchema)
      .refine((c) => typeof (c as Record<string, unknown>).neutral === 'string', {
        message: 'Theme colors must include a "neutral" color.',
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
