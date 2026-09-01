import { z } from 'zod';
import { convertToHex } from '../../colors/index.ts';
import { defaultBorderRadius, defaultFontFamily } from '../defaults.ts';
import { overridesSchema } from '../v1.1/schema.ts';

const hexPatterns = [
  // Hex colors: #000, #0000, #000000, #00000000
  `#[0-9a-fA-F]{3}`,
  `#[0-9a-fA-F]{4}`,
  `#[0-9a-fA-F]{6}`,
  `#[0-9a-fA-F]{8}`,
];

const colorRegex = new RegExp(`^${hexPatterns.join('|')}$`);

const colorSchema = z
  .string()
  .regex(colorRegex)
  .transform(convertToHex)
  .describe(`A hex color, which is used for creating a color scale.`);

const typographyTokenSchema = (defaults: {
  fontWeight: string;
  lineHeight: string;
  fontSize: string;
  letterSpacing: string;
}) =>
  z
    .object({
      fontFamily: z.string().default('{font-family}'),
      fontWeight: z.string().default(defaults.fontWeight),
      lineHeight: z.string().default(defaults.lineHeight),
      fontSize: z.string().default(defaults.fontSize),
      letterSpacing: z.string().default(defaults.letterSpacing),
    })
    .prefault({});

const headingTokenSchema = (fontSize: number, letterSpacing: number) =>
  typographyTokenSchema({
    fontWeight: '{font-weight.medium}',
    lineHeight: '{line-height.sm}',
    fontSize: `{font-size.${fontSize}}`,
    letterSpacing: `{letter-spacing.${letterSpacing}}`,
  });

const bodyTokenSchema = (lineHeight: string, fontSize: number, letterSpacing: number) =>
  typographyTokenSchema({
    fontWeight: '{font-weight.regular}',
    lineHeight: `{line-height.${lineHeight}}`,
    fontSize: `{font-size.${fontSize}}`,
    letterSpacing: `{letter-spacing.${letterSpacing}}`,
  });

const bodyTokens = (lineHeight: string) => ({
  xl: bodyTokenSchema(lineHeight, 6, 8),
  lg: bodyTokenSchema(lineHeight, 5, 8),
  md: bodyTokenSchema(lineHeight, 4, 8),
  sm: bodyTokenSchema(lineHeight, 3, 7),
  xs: bodyTokenSchema(lineHeight, 2, 6),
});

const typographySchema = z
  .object({
    fontFamily: z.string().meta({ description: 'Sets the font-family for this theme' }).default(defaultFontFamily),
    components: z
      .object({
        heading: z
          .object({
            '2xl': headingTokenSchema(10, 1),
            xl: headingTokenSchema(9, 1),
            lg: headingTokenSchema(8, 2),
            md: headingTokenSchema(7, 3),
            sm: headingTokenSchema(6, 5),
            xs: headingTokenSchema(5, 6),
            '2xs': headingTokenSchema(4, 6),
          })
          .meta({ description: 'Typography tokens for headings' })
          .prefault({}),
        body: z
          .object({
            ...bodyTokens('md'),
            short: z
              .object(bodyTokens('sm'))
              .meta({ description: 'Typography tokens for short body text' })
              .prefault({}),
            long: z.object(bodyTokens('lg')).meta({ description: 'Typography tokens for long body text' }).prefault({}),
          })
          .meta({ description: 'Typography tokens for body text' })
          .prefault({}),
      })
      .meta({ description: 'Typography tokens for components' })
      .prefault({}),
  })
  .describe('Defines the typography for a given theme')
  .prefault({});

const sizeScale = (steps: number[]): Record<string, string> =>
  Object.fromEntries(steps.map((step) => [String(step), `floor({step} / {base} * {fontSize} * ${step})`]));

const sizeObjectSchema = z
  .object({
    steps: z
      .record(
        z.string(),
        z.object({
          base: z.number().describe('The base value for the size scale'),
          step: z.number().describe('The scale value between each step of the size scale'),
          fontSize: z.number().describe('Unitless font size value for the size scale'),
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
        fontSize: 16,
        base: 18,
        step: 4,
      },
      medium: {
        fontSize: 18,
        base: 18,
        step: 4,
      },
      large: {
        fontSize: 21,
        base: 18,
        step: 4,
      },
    },
  });

const borderRadiusNumberSchema = z
  .number()
  .meta({ description: 'Defines the border-radius for this theme' })
  .default(defaultBorderRadius);

const defaultBorderRadiusSteps = {
  sm: 'min({base}*0.5,{scale})',
  md: 'min({base},{scale}*2)',
  lg: 'min({base}*2,{scale}*5)',
  xl: 'min({base}*3,{scale}*7)',
  default: '{base}',
  full: '9999',
};

const borderRadiusObjectSchema = z
  .object({
    steps: z
      .record(z.string(), z.string())
      .describe('The steps for the border-radius scale, e.g. "sm", "md", "lg", etc.'),
    base: z.number().describe('The base value for the border-radius scale'),
    scale: z.number().describe('The scale value between each step of the border-radius scale'),
  })
  .meta({ description: 'Defines the border-radius values for this theme' })
  .default({
    steps: defaultBorderRadiusSteps,
    base: 4,
    scale: 4, // TODO rename this to "step" to match the size scale, but this will be a breaking change for existing themes
  });

const borderRadiusSchema = z
  .union([borderRadiusNumberSchema, borderRadiusObjectSchema])
  // Normalize the number shorthand so consumers always get the object form.
  .transform((borderRadius) =>
    typeof borderRadius === 'number'
      ? { steps: defaultBorderRadiusSteps, base: borderRadius, scale: 4 }
      : borderRadius,
  )
  .meta({ description: 'Defines the border-radius for this theme' });

const themeSchema = z
  .object({
    colors: z
      .record(z.string(), colorSchema)
      .refine((c) => typeof (c as Record<string, unknown>).neutral === 'string', {
        message: 'Theme colors must include a "neutral" color.',
      })
      .meta({ description: 'Defines the colors for this theme' }),
    typography: typographySchema,
    size: sizeObjectSchema,
    borderRadius: borderRadiusSchema,
    overrides: overridesSchema,
  })
  .meta({ description: 'An object defining a theme. The property name holding the object becomes the theme name.' });

export const themesSchema = z
  .record(z.string(), themeSchema)
  // Validate that all themes have the same color names. This happens only in runtime i.e. when `validateConfig` is called.
  .superRefine((themes, ctx) => {
    const entries = Object.entries(themes);
    if (entries.length < 2) return;

    const [referenceName, referenceTheme] = entries[0];
    const referenceKeys = new Set(Object.keys(referenceTheme.colors));

    for (const [themeName, theme] of entries.slice(1)) {
      const themeKeys = new Set(Object.keys(theme.colors));
      const missing = [...referenceKeys].filter((key) => !themeKeys.has(key));
      const extra = [...themeKeys].filter((key) => !referenceKeys.has(key));

      if (missing.length > 0 || extra.length > 0) {
        const details = [
          missing.length > 0 ? `missing: ${missing.join(', ')}` : undefined,
          extra.length > 0 ? `unexpected: ${extra.join(', ')}` : undefined,
        ]
          .filter(Boolean)
          .join('; ');

        ctx.addIssue({
          code: 'custom',
          path: [themeName, 'colors'],
          message: `All themes must define the same color names. Theme "${themeName}" does not match theme "${referenceName}" (${details}).`,
        });
      }
    }
  })
  .meta({
    description:
      'An object with one or more themes. Each property defines a theme, and the property name is used as the theme name.',
  });

export type ConfigSchemaTheme = z.infer<typeof themeSchema>;
