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

const _sizeSchema = z
  .string()
  .regex(/^\d+(\.\d+)?(px|em|rem|%)$/)
  .describe(`A size value, which can be in px, em, rem, or % units.`);

/**
   * _size: {
    '0': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 0)',
    },
    '1': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 1)',
    },
    '2': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 2)',
    },
    '3': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 3)',
    },
    '4': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 4)',
    },
    '5': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 5)',
    },
    '6': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 6)',
    },
    '7': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 7)',
    },
    '8': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 8)',
    },
    '9': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 9)',
    },
    '10': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 10)',
    },
    '11': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 11)',
    },
    '12': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 12)',
    },
    '13': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 13)',
    },
    '14': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 14)',
    },
    '15': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 15)',
    },
    '18': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 18)',
    },
    '22': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 22)',
    },
    '26': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 26)',
    },
    '30': {
      $type: 'dimension',
      $value: 'floor({_size.unit} * 30)',
    },
    'mode-font-size': {
      $type: 'number',
      $value: '{size._mode-font-size}',
    },
    base: {
      $type: 'number',
      $value: '{size._base}',
    },
    step: {
      $type: 'number',
      $value: '{size._step}',
    },
    unit: {
      $type: 'number',
      $value: '{_size.step} / {_size.base} * {_size.mode-font-size}',
    },
  },
   */

const _sizeObjectSchema = z
  .object({
    steps: z.record(
      z.string(),
      z.object({
        base: z.number().describe('The base value for the size scale'),
        step: z.number().describe('The scale value between each step of the size scale'),
        fontSize: z.number().describe('Unitless font size value for the size scale'),
      }),
    ),

    scale: z.record(z.string(), z.string()).describe('The scale values for the size scale'),
  })
  .meta({ description: 'Defines the size values for this theme' })
  .default({
    scale: {
      '0': 'floor({step} / {base} * {fontSize} * 0)',
      '1': 'floor({step} / {base} * {fontSize} * 1)',
      '2': 'floor({step} / {base} * {fontSize} * 2)',
      '3': 'floor({step} / {base} * {fontSize} * 3)',
      '4': 'floor({step} / {base} * {fontSize} * 4)',
      '5': 'floor({step} / {base} * {fontSize} * 5)',
      '6': 'floor({step} / {base} * {fontSize} * 6)',
      '7': 'floor({step} / {base} * {fontSize} * 7)',
      '8': 'floor({step} / {base} * {fontSize} * 8)',
      '9': 'floor({step} / {base} * {fontSize} * 9)',
      '10': 'floor({step} / {base} * {fontSize} * 10)',
      '11': 'floor({step} / {base} * {fontSize} * 11)',
      '12': 'floor({step} / {base} * {fontSize} * 12)',
      '13': 'floor({step} / {base} * {fontSize} * 13)',
      '14': 'floor({step} / {base} * {fontSize} * 14)',
      '15': 'floor({step} / {base} * {fontSize} * 15)',
      '18': 'floor({step} / {base} * {fontSize} * 18)',
      '22': 'floor({step} / {base} * {fontSize} * 22)',
      '26': 'floor({step} / {base} * {fontSize} * 26)',
      '30': 'floor({step} / {base} * {fontSize} * 30)',
    },
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
    steps: {
      sm: 'min({borderRadius.base}*0.5,{borderRadius.scale})',
      md: 'min({borderRadius.base},{borderRadius.scale}*2)',
      lg: 'min({borderRadius.base}*2,{borderRadius.scale}*5)',
      xl: 'min({borderRadius.base}*3,{borderRadius.scale}*7)',
      default: '{borderRadius.base}',
      full: '9999',
    },
    base: 4,
    scale: 4,
  });

const themeSchema = z
  .object({
    colors: z
      .record(z.string(), colorSchema)
      .refine((c) => typeof (c as Record<string, unknown>).neutral === 'string', {
        message: 'Theme colors must include a "neutral" color.',
      })
      .meta({ description: 'Defines the colors for this theme' }),
    typography: z
      .object({
        fontFamily: z.string().meta({ description: 'Sets the font-family for this theme' }).default(defaultFontFamily),
      })
      .describe('Defines the typography for a given theme')
      .prefault({}),
    borderRadius: z
      .union([borderRadiusNumberSchema, borderRadiusObjectSchema])
      .meta({ description: 'Defines the border-radius for this theme' }),
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
