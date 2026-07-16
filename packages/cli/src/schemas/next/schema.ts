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
  banner: z.string().default('my banner').describe('A banner to include at the top of the CSS file'),
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

export const nextConfigSchema = configFileCreateSchema
  .extend({
    output: z.array(outputSchema).describe('An array of output files'),
  })
  // Omit the `clean` and `outDir` properties from the schema, as they are now handled by the `output` property.
  .omit({ clean: true, outDir: true });

export type NextConfigSchema = z.infer<typeof nextConfigSchema>;
