import pc from 'picocolors';
import { z } from 'zod';
import { configFileCreateSchema } from '../v1.1/schema.ts';

const designTokensOutputSchema = z.object({
  type: z.literal('design-tokens').describe('The type of output file'),
  dir: z.string().default('design-tokens').describe('The output directory'),
  cleanDir: z.boolean().default(true).describe('Whether to clean the output directory before generating files'),
});

const cssOutputSchema = z.object({
  type: z.literal('css').describe('The type of output file'),
  dir: z.string().default('design-tokens-build').describe('The output directory'),
  cleanDir: z.boolean().default(true).describe('Whether to clean the output directory before generating files'),
  tokenDir: z.string().default('design-tokens').describe('The directory containing the design tokens'),
  banner: z.string().default('').describe('A banner to include at the top of the CSS file'),
  experimental_tailwind: z.boolean().default(true).describe('Whether to enable experimental Tailwind support'),
});

const outputObjectSchema = z
  .union([designTokensOutputSchema, cssOutputSchema])
  .describe('An object representing an output file');

const outputShorthandSchema = z
  .enum(['design-tokens', 'css'])
  .describe('An output type using its default settings')
  .transform((type) => ({ type }))
  .pipe(outputObjectSchema);

const outputSchema = z
  .union([outputObjectSchema, outputShorthandSchema])
  .describe('An output file, either as an object or an output type using its default settings');

/** Fields superseded by `output`. Kept so existing config files keep validating. */
const deprecatedFields = ['outDir', 'clean'] as const;

/**
 * The plain object schema. Use this when you need `.shape` (e.g. to generate the
 * JSON schema); use {@link configSchema} to validate a config.
 */
export const configObjectSchema = configFileCreateSchema.extend({
  output: z.array(outputSchema).describe('An array of output files'),
  // No `.default()` on the deprecated fields: we need `undefined` when the user did not
  // set them, so we can warn only when they actually did.
  outDir: z.string().optional().meta({
    deprecated: true,
    description: 'Deprecated: use `output[].dir` instead. Ignored when `output` is set.',
  }),
  clean: z.boolean().optional().meta({
    deprecated: true,
    description: 'Deprecated: use `output[].cleanDir` instead. Ignored when `output` is set.',
  }),
});

export const configSchema = configObjectSchema.superRefine((config) => {
  // Non-fatal: warn about deprecated fields instead of failing validation.
  for (const key of deprecatedFields) {
    if (config[key] !== undefined) {
      console.warn(pc.yellow(`⚠️  "${key}" is deprecated and ignored; use "output" instead.`));
    }
  }
});

export type ConfigSchema = z.infer<typeof configSchema>;
