import { z } from 'zod';

export const opacitySchema = z
  .object({
    disabled: z.string().default('30%').describe('The opacity used for disabled states'),
  })
  .prefault({});
