import { z } from 'zod';
import { convertToHex } from '../colors/index.ts';
import { addSeverityColors } from './defaults.ts';

const hexPatterns = [
  // Hex colors: #000, #0000, #000000, #00000000
  `#[0-9a-fA-F]{3}`,
  `#[0-9a-fA-F]{4}`,
  `#[0-9a-fA-F]{6}`,
  `#[0-9a-fA-F]{8}`,
];

const colorRegex = new RegExp(`^(${hexPatterns.join('|')})$`);

/** Whether a value is a hex color a config accepts: 3, 4, 6 or 8 hex digits after `#` */
export const isHexColor = (value: string) => colorRegex.test(value);

export const colorSchema = z
  .string()
  .regex(colorRegex)
  .transform(convertToHex)
  .describe(`A hex color, which is used for creating a color scale.`);

// Color names end up in token paths, CSS variables and class names, so they are restricted to
// lowercase letters and digits, with single hyphens between them. A name cannot start or end with a hyphen:
// `--a` would be a custom property or a command line flag, and `a-` and `a--b` read as mistakes.
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const colorNameSchema = z
  .string()
  .regex(namePattern, {
    message:
      'Color names may only contain lowercase letters (a-z) and digits (0-9), with single hyphens (-) between them.',
  })
  .describe('The name of a color, used in token paths and CSS variables.');

// Theme names end up in file names, CSS selectors and token paths, so they follow the same rule as color names.
// The config schema does not enforce this yet, since that would reject existing configs. Tools that create
// themes, like the theme builder, use it so that new theme names are safe.
export const themeNameSchema = z
  .string()
  .regex(namePattern, {
    message:
      'Theme names may only contain lowercase letters (a-z) and digits (0-9), with single hyphens (-) between them.',
  })
  .describe('The name of a theme, used in file names, CSS selectors and token paths.');

export const colorsSchema = z
  .record(colorNameSchema, colorSchema)
  .refine((c) => typeof (c as Record<string, unknown>).neutral === 'string', {
    message: 'Theme colors must include a "neutral" color.',
  })
  // Adds the default severity colors that are missing, and moves all severity colors last.
  .transform(addSeverityColors)
  .meta({ description: 'Defines the colors for this theme' });
