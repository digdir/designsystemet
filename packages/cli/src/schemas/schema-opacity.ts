import { z } from 'zod';

// The primitive token key is derived from the numeric part of the value (e.g. '30%' -> '30'),
// so only percentages between 0% and 100% are accepted. Anything else would produce an `{opacity.NaN}` reference.
const opacityValueSchema = z
  .string()
  .regex(/^\d*\.?\d+%$/, 'Expected a percentage such as "30%"')
  // `NaN > 100` is false, so values already rejected by the regex do not report a second issue here.
  .refine((value) => !(Number.parseFloat(value) > 100), 'Opacity must be between 0% and 100%');

export const opacitySchema = z
  .object({
    disabled: opacityValueSchema.default('30%').describe('The opacity used for disabled states'),
  })
  .prefault({});
