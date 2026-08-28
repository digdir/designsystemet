import type { z } from 'zod';
import { configObjectSchema as baseConfigObjectSchema } from '../v1.2/schema.ts';
import { themesSchema } from './schema-themes.ts';

export const configObjectSchema = baseConfigObjectSchema.extend({
  themes: themesSchema,
});

export type ConfigSchema = z.infer<typeof configObjectSchema>;
