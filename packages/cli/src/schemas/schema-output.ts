import pc from 'picocolors';
import { z } from 'zod';

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
  .describe('An output file, either as an object or an output type using its default settings.');

/** Fields superseded by `output`. Kept so existing config files and `tokens create` keep working. */
const deprecatedFields = ['outDir', 'clean'] as const;

/** The output settings of a config. `outDir` and `clean` are used by `tokens create`, `output` by the `config` command. */
export const outputConfigShape = {
  output: z
    .array(outputSchema)
    .prefault(['design-tokens', 'css'])
    .describe('An array of output types. These are run in the order they are specified.'),
  /** @deprecated Use `output[].dir` instead. */
  outDir: z.string().default('design-tokens').meta({
    deprecated: true,
    description: 'Deprecated: use `output[].dir` instead. Path to the output directory for the created design tokens',
  }),
  /** @deprecated Use `output[].cleanDir` instead. */
  clean: z
    .boolean()
    .default(false)
    .meta({
      deprecated: true,
      description: 'Deprecated: use `output[].cleanDir` instead. Delete the output directory before creating tokens',
    })
    .optional(),
};

/** Non-fatal: warn about deprecated fields set in a config file instead of failing validation. */
export const warnDeprecatedFields = (config: Partial<Record<(typeof deprecatedFields)[number], unknown>>) => {
  for (const key of deprecatedFields) {
    if (config[key] !== undefined) {
      console.warn(
        pc.yellow(
          `⚠️  Config field "${key}" is deprecated and will be removed in a future release; use "output" instead.`,
        ),
      );
    }
  }
};
