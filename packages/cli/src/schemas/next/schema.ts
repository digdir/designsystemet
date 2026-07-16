import { z } from 'zod';
import { configFileCreateSchema } from '../v1.1/schema.ts';

const designTokensOutputSchema = z.object({
  type: z.literal('design-tokens').describe('The type of output file'),
  dir: z.string().default('design-tokens').describe('The output directory'),
  cleanDir: z.boolean().default(true).describe('Whether to clean the output directory before generating files'),
});

const cssOutputSchema = z.object({
  type: z.literal('css').describe('The type of output file'),
  dir: z.string().default('css').describe('The output directory'),
  cleanDir: z.boolean().default(true).describe('Whether to clean the output directory before generating files'),
  tokenDir: z.string().default('design-tokens').describe('The directory containing the design tokens'),
  banner: z.string().default('my banner').describe('A banner to include at the top of the CSS file'),
  experimental_tailwind: z.boolean().default(true).describe('Whether to enable experimental Tailwind support'),
});

const outputSchema = z
  .union([designTokensOutputSchema, cssOutputSchema])
  .describe('An object representing an output file');

export const rootConfig = configFileCreateSchema.extend({
  output: z.array(outputSchema).describe('An array of output files'),
});

export type RootConfigSchema = z.infer<typeof rootConfig>;
