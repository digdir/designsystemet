import { z } from 'zod';
import { defaultBorderRadius } from '../defaults.ts';

const borderRadiusNumberSchema = z
  .number()
  .meta({ description: 'Defines the border-radius for this theme' })
  .default(defaultBorderRadius);

const defaultBorderRadiusSteps = {
  sm: 'min({base}*0.5,{scale})',
  md: 'min({base},{scale}*2)',
  lg: 'min({base}*2,{scale}*5)',
  xl: 'min({base}*3,{scale}*7)',
  default: '{base}',
  full: '9999',
};

const borderRadiusObjectSchema = z
  .object({
    steps: z
      .record(z.string(), z.string())
      .describe('The steps for the border-radius scale, e.g. "sm", "md", "lg", etc.'),
    base: z.number().describe('The base value for the border-radius scale'),
    scale: z.number().describe('The scale value between each step of the border-radius scale'),
  })
  .meta({ description: 'Defines the border-radius values for this theme' })
  .default({
    steps: defaultBorderRadiusSteps,
    base: 4,
    scale: 4, // TODO rename this to "step" to match the size scale, but this will be a breaking change for existing themes
  });

export const borderRadiusSchema = z
  .union([borderRadiusNumberSchema, borderRadiusObjectSchema])
  // Normalize the number shorthand so consumers always get the object form.
  .transform((borderRadius) =>
    typeof borderRadius === 'number' ? { steps: defaultBorderRadiusSteps, base: borderRadius, scale: 4 } : borderRadius,
  )
  .meta({ description: 'Defines the border-radius for this theme' });
