import { z } from 'zod';

export const borderWidthSchema = z
  .object({
    default: z.string().default('1px').describe('The default border width for components'),
    focus: z.string().default('3px').describe('The border outline for focus states'),
  })
  .prefault({});
