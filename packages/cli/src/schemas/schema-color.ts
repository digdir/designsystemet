import { z } from 'zod';
import { convertToHex } from '../colors/index.ts';
import { severityColorNames, sortSeverityColorsLast } from './defaults.ts';

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

// Color names end up in token paths, CSS variables and class names, so they are restricted to
// lowercase letters, digits and hyphens. Matches the sanitizing done by the theme builder.
export const colorNameSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, {
    message: 'Color names may only contain lowercase letters (a-z), digits (0-9) and hyphens (-).',
  })
  .describe('The name of a color, used in token paths and CSS variables.');

export const colorsSchema = z
  .record(colorNameSchema, colorSchema)
  // Severity colors are optional extras, so a theme needs at least one color of its own.
  .refine((c) => Object.keys(c).some((name) => !(severityColorNames as string[]).includes(name)), {
    message: 'Theme colors must include at least one color that is not a severity color.',
  })
  // Moves the severity colors last. They are optional, so none are added.
  .transform(sortSeverityColorsLast)
  .meta({ description: 'Defines the colors for this theme' });
