import { z } from 'zod';
import { defaultFontFamily } from './defaults.ts';

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

const typographyFontSchema = z
  .object({
    fontFamily: z.string().meta({ description: 'Sets the font-family for this theme' }).default(defaultFontFamily),
    fontWeight: z
      .object({
        medium: z.string().meta({ description: 'Sets the medium font-weight for this theme' }).default('Medium'),
        semibold: z.string().meta({ description: 'Sets the semibold font-weight for this theme' }).default('Semi bold'),
        regular: z.string().meta({ description: 'Sets the regular font-weight for this theme' }).default('Regular'),
      })
      .prefault({}),
  })
  .describe('Defines a named typography set')
  .prefault({});

export type TypographyFontSchema = z.infer<typeof typographyFontSchema>;

const fontSizeScale = (sizes: number[]): Record<string, string> =>
  Object.fromEntries(sizes.map((size, index) => [String(index + 1), String(size)]));

const letterSpacingDescription = 'Sets the letter-spacing for this size mode';

const typographySizeSchema = z
  .object({
    lineHeight: z
      .object({
        sm: z.string().meta({ description: 'Sets the small line-height for this size mode' }).default('130%'),
        md: z.string().meta({ description: 'Sets the medium line-height for this size mode' }).default('150%'),
        lg: z.string().meta({ description: 'Sets the large line-height for this size mode' }).default('170%'),
      })
      .prefault({}),
    letterSpacing: z
      .object({
        '1': z.string().meta({ description: letterSpacingDescription }).default('-1%'),
        '2': z.string().meta({ description: letterSpacingDescription }).default('-0.5%'),
        '3': z.string().meta({ description: letterSpacingDescription }).default('-0.25%'),
        '4': z.string().meta({ description: letterSpacingDescription }).default('-0.15%'),
        '5': z.string().meta({ description: letterSpacingDescription }).default('0%'),
        '6': z.string().meta({ description: letterSpacingDescription }).default('0.15%'),
        '7': z.string().meta({ description: letterSpacingDescription }).default('0.25%'),
        '8': z.string().meta({ description: letterSpacingDescription }).default('0.5%'),
        '9': z.string().meta({ description: letterSpacingDescription }).default('1.5%'),
      })
      .prefault({}),
    fontSize: z
      .record(z.string(), z.string())
      .meta({ description: 'The unitless font-size scale for this size mode, keyed by scale number' }),
  })
  .describe('Defines the line-heights, letter-spacings and font-size scale for a size mode');

export type TypographySizeSchema = z.infer<typeof typographySizeSchema>;

const typographyObjectSchema = z
  .object({
fonts: z
      .record(
        z.string().refine((name) => name !== 'size', {
          message: '"size" is reserved for size-mode typography token sets.',
        }),
        typographyFontSchema,
      )
      .meta({ description: 'Named typography sets, e.g. "primary" and "secondary". The key becomes the set name.' })
      .prefault({ primary: {}, secondary: {} })
    size: z
      .record(z.string(), typographySizeSchema)
      .meta({
        description:
          'Typography values per size mode, keyed by the step name from `size.steps`. Shared by all typography sets.',
      })
      .prefault({
        small: { fontSize: fontSizeScale([11, 13, 14, 16, 18, 21, 24, 30, 36, 48]) },
        medium: { fontSize: fontSizeScale([12, 14, 16, 18, 21, 24, 30, 36, 48, 60]) },
        large: { fontSize: fontSizeScale([13, 16, 18, 21, 24, 30, 36, 48, 60, 72]) },
      }),
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
      .meta({ description: 'Typography tokens for components, shared by all typography sets' })
      .prefault({}),
  })
  .describe('Defines the typography sets, size-mode typography and component typography for a given theme')
  .prefault({});

export type TypographySchema = z.infer<typeof typographyObjectSchema>;

// The shorthand form: only a font-family. Strict, so an object defining named sets never matches it.
export const typographyShorthandSchema = z
  .strictObject({
    fontFamily: z.string().meta({ description: 'Sets the font-family for this theme' }).default(defaultFontFamily),
  })
  .prefault({})
  // Normalize the shorthand into the default named sets, so consumers always get the object form.
  .transform(
    ({ fontFamily }): TypographySchema =>
      typographyObjectSchema.parse({ fonts: { primary: { fontFamily }, secondary: { fontFamily } } }),
  );

export const typographySchema = z
  .union([typographyShorthandSchema, typographyObjectSchema])
  .describe('Defines the typography for a given theme');
