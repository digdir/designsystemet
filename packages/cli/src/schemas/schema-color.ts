import { z } from 'zod';
import { convertToHex } from '../colors/index.ts';
import { semanticColorNames } from '../colors/specs.ts';
import type { CssColor, SemanticColorNames } from '../colors/types.ts';
import { addSeverityColors } from './defaults.ts';

const hexPatterns = [
  // Hex colors: #000, #0000, #000000, #00000000
  `#[0-9a-fA-F]{3}`,
  `#[0-9a-fA-F]{4}`,
  `#[0-9a-fA-F]{6}`,
  `#[0-9a-fA-F]{8}`,
];

const colorRegex = new RegExp(`^(${hexPatterns.join('|')})$`);

export const colorSchema = z
  .string()
  .regex(colorRegex)
  .transform(convertToHex)
  .describe(`A hex color, which is used for creating a color scale.`);

const colorStepSchema = z
  .object({
    light: colorSchema.optional().describe('A hex color for light mode'),
    dark: colorSchema.optional().describe('A hex color for dark mode'),
  })
  .strict()
  .describe('The hex colors of this step in light and dark mode. A mode that is left out is generated.');

const baseColorStepSchema = z
  .object({
    light: colorSchema.describe(
      'A hex color for light mode. Also the base color the steps that are left out are generated from.',
    ),
    dark: colorSchema.optional().describe('A hex color for dark mode'),
  })
  .strict()
  .describe(
    'The hex colors of the "base-default" step in light and dark mode. Its light color is the base color the steps that are left out are generated from.',
  );

const colorStepsShape = Object.fromEntries(
  semanticColorNames.map((name) => [name, name === 'base-default' ? baseColorStepSchema : colorStepSchema.optional()]),
) as Record<Exclude<SemanticColorNames, 'base-default'>, z.ZodOptional<typeof colorStepSchema>> & {
  'base-default': typeof baseColorStepSchema;
};

export const colorStepsSchema = z
  .object(colorStepsShape)
  .strict()
  .describe(
    'The color steps of a color scale, e.g. "background-default" or "base-default", each with a hex color for light and dark mode. "base-default" with a light color is required, as it is the base color; every step or mode that is left out is generated from it.',
  );

export const colorDefinitionSchema = z
  .union([colorSchema, colorStepsSchema])
  .describe(
    'A color. Either a hex color, which the whole color scale is generated from, or an object with the color steps of the scale, which lets you set each step in light and dark mode.',
  );

/** A color as written in the config: a base color, or the steps of its scale. */
export type ColorDefinition = z.infer<typeof colorDefinitionSchema>;
/** The steps of a color scale as written in the config. */
export type ColorSteps = z.infer<typeof colorStepsSchema>;

/** The base color of a color, which its scale is generated from: the color itself, or its `base-default` in light. */
export const getBaseColor = (color: ColorDefinition | CssColor): CssColor =>
  typeof color === 'string' ? (color as CssColor) : color['base-default'].light;

/** The steps a color sets itself, or undefined when the color is only a base color. */
export const getColorSteps = (color: ColorDefinition | CssColor): ColorSteps | undefined =>
  typeof color === 'string' ? undefined : color;

// Color names end up in token paths, CSS variables and class names, so they are restricted to
// lowercase letters, digits and hyphens. Matches the sanitizing done by the theme builder.
export const colorNameSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, {
    message: 'Color names may only contain lowercase letters (a-z), digits (0-9) and hyphens (-).',
  })
  .describe('The name of a color, used in token paths and CSS variables.');

export const colorsSchema = z
  .record(colorNameSchema, colorDefinitionSchema)
  .refine((c) => Object.hasOwn(c, 'neutral'), {
    message: 'Theme colors must include a "neutral" color.',
  })
  // Adds the default severity colors that are missing, and moves all severity colors last.
  .transform(addSeverityColors)
  .meta({ description: 'Defines the colors for this theme' });
