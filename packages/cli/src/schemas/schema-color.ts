import { z } from 'zod';
import { convertToHex } from '../colors/index.ts';

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
  .refine((c) => typeof (c as Record<string, unknown>).neutral === 'string', {
    message: 'Theme colors must include a "neutral" color.',
  })
  .meta({ description: 'Defines the colors for this theme' });
