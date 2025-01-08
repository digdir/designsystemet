import { z } from 'zod';
import { convertToHex } from '../src/colors/index.js';

/**
 * This defines the structure of the JSON config file
 */
export const configFileSchema = z.object({
  outDir: z.string().optional(),
  themes: z.record(
    z.object({
      colors: z.object({
        main: z.record(z.string().transform(convertToHex)),
        support: z.record(z.string().transform(convertToHex)),
        neutral: z.string().transform(convertToHex),
      }),
      typography: z.object({
        fontFamily: z.string(),
      }),
      borderRadius: z.number(),
    }),
  ),
});

/**
 * This defines the structure of the final configuration after combining the config file,
 * command-line options and default values.
 */
export const combinedConfigSchema = configFileSchema.required();
export type CombinedConfigSchema = z.infer<typeof combinedConfigSchema>;
