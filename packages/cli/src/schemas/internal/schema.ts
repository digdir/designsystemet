import type { z } from 'zod';
import { configFileCreateSchema as baseConfigFileCreateSchema } from '../v1.1/schema.ts';
import { configObjectSchema as baseConfigObjectSchema, warnDeprecatedFields } from '../v1.2/schema.ts';
import { themesSchema } from './schema-themes.ts';

export const configObjectSchema = baseConfigObjectSchema.extend({
  themes: themesSchema,
});

export const configSchema = configObjectSchema.superRefine(warnDeprecatedFields);

export type ConfigSchema = z.infer<typeof configObjectSchema>;

/** The `tokens create` config validated against the internal themes schema. */
export const configFileCreateSchema = baseConfigFileCreateSchema.extend({
  themes: themesSchema,
});

export type CreateConfigSchema = z.infer<typeof configFileCreateSchema>;
