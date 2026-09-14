import { z } from 'zod';

const sizeScale = (steps: number[]): Record<string, string> =>
  Object.fromEntries(steps.map((step) => [String(step), `floor({step} / {base} * {baseFontSize} * ${step})`]));

export const sizeSchema = z
  .object({
    steps: z
      .record(
        z.string(),
        z.object({
          base: z.number().describe('The base value for the size scale'),
          step: z.number().describe('The scale value between each step of the size scale'),
          baseFontSize: z.number().describe('Unitless base font size for this size step'),
        }),
      )
      .meta({
        description:
          'The steps for the size scale, e.g. "small", "medium", "large", etc. Each step needs a matching entry in `typography.size`.',
      }),

    scale: z.record(z.string(), z.string()).describe('The scale values for the size scale'),
  })
  .meta({ description: 'Defines the size values for this theme' })
  .default({
    scale: sizeScale([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 22, 26, 30]),
    steps: {
      small: {
        baseFontSize: 16,
        base: 18,
        step: 4,
      },
      medium: {
        baseFontSize: 18,
        base: 18,
        step: 4,
      },
      large: {
        baseFontSize: 21,
        base: 18,
        step: 4,
      },
    },
  });
