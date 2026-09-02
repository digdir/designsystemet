import { z } from 'zod';

const sizeScale = (steps: number[]): Record<string, string> =>
  Object.fromEntries(steps.map((step) => [String(step), `floor({step} / {base} * {baseFontSize} * ${step})`]));

const fontSizeScale = (sizes: number[]): Record<string, string> =>
  Object.fromEntries(sizes.map((size, index) => [String(index + 1), String(size)]));

export const sizeSchema = z
  .object({
    steps: z
      .record(
        z.string(),
        z.object({
          base: z.number().describe('The base value for the size scale'),
          step: z.number().describe('The scale value between each step of the size scale'),
          baseFontSize: z.number().describe('Unitless base font size for this size step'),
          fontSizes: z
            .record(z.string(), z.string())
            .describe('The unitless font-size scale for this size step, keyed by scale number'),
        }),
      )
      .meta({ description: 'The steps for the size scale, e.g. "small", "medium", "large", etc.' }),

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
        fontSizes: fontSizeScale([11, 13, 14, 16, 18, 21, 24, 30, 36, 48]),
      },
      medium: {
        baseFontSize: 18,
        base: 18,
        step: 4,
        fontSizes: fontSizeScale([12, 14, 16, 18, 21, 24, 30, 36, 48, 60]),
      },
      large: {
        baseFontSize: 21,
        base: 18,
        step: 4,
        fontSizes: fontSizeScale([13, 16, 18, 21, 24, 30, 36, 48, 60, 72]),
      },
    },
  });
