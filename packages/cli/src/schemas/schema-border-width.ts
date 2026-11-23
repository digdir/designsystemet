import { z } from 'zod';

// The primitive token key is derived from the numeric part of the value (e.g. '3px' -> '3'),
// so only non-negative CSS lengths are accepted. Anything else would produce a `{border-width.NaN}` reference.
const borderWidthValueSchema = z
  .string()
  .regex(/^(0|\d*\.?\d+(px|rem|em))$/, 'Expected a non-negative CSS length such as "1px", "0.5rem" or "0"');

export const borderWidthSchema = z
  .object({
    default: borderWidthValueSchema.default('1px').describe('The default border width for components'),
    focus: borderWidthValueSchema.default('3px').describe('The border outline for focus states'),
  })
  .prefault({});
