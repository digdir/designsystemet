import * as R from 'ramda';
import { z } from 'zod';
import { convertToHex } from '../../colors/index.ts';
import { configFileCreateSchema as baseConfigFileCreateSchema, overridesSchema } from '../v1.1/schema.ts';
import { configObjectSchema as baseConfigObjectSchema, warnDeprecatedFields } from '../v1.2/schema.ts';
import { borderRadiusSchema } from './schema-border-radius.ts';
import { borderWidthSchema } from './schema-border-width.ts';
import { opacitySchema } from './schema-opacity.ts';
import { shadowSchema } from './schema-shadow.ts';
import { sizeSchema } from './schema-size.ts';
import { typographySchema } from './schema-typography.ts';

const hexPatterns = [
  // Hex colors: #000, #0000, #000000, #00000000
  `#[0-9a-fA-F]{3}`,
  `#[0-9a-fA-F]{4}`,
  `#[0-9a-fA-F]{6}`,
  `#[0-9a-fA-F]{8}`,
];

const colorRegex = new RegExp(`^(${hexPatterns.join('|')})$`);

const colorSchema = z
  .string()
  .regex(colorRegex)
  .transform(convertToHex)
  .describe(`A hex color, which is used for creating a color scale.`);

const themeSchema = z
  .object({
    colors: z
      .record(z.string(), colorSchema)
      .refine((c) => typeof (c as Record<string, unknown>).neutral === 'string', {
        message: 'Theme colors must include a "neutral" color.',
      })
      .meta({ description: 'Defines the colors for this theme' }),
    typography: typographySchema,
    size: sizeSchema,
    borderRadius: borderRadiusSchema,
    overrides: overridesSchema,
    'border-width': borderWidthSchema,
    shadow: shadowSchema,
    opacity: opacitySchema,
  })
  .meta({ description: 'An object defining a theme. The property name holding the object becomes the theme name.' })
  // Validate that token references in each typography set's components (e.g. '{letter-spacing.3}')
  // point to keys defined in this theme.
  .superRefine((theme, ctx) => {
    // font-size references must resolve in every size mode, so only keys present in all steps count.
    const fontSizeKeys = new Set<string>();
    const steps = Object.values(theme.size.steps);
    for (const key of Object.keys(steps[0]?.fontSizes ?? {})) {
      if (steps.every((step) => key in step.fontSizes)) {
        fontSizeKeys.add(key);
      }
    }

    const checkGroup = (
      group: Record<string, unknown>,
      path: (string | number)[],
      availableKeys: Record<string, Set<string>>,
    ) => {
      for (const [name, value] of Object.entries(group)) {
        if (typeof value === 'string') {
          for (const [, prefix, key] of value.matchAll(/\{([\w-]+)\.([\w.-]+)\}/g)) {
            const known = availableKeys[prefix];
            if (!known) {
              ctx.addIssue({
                code: 'custom',
                path: [...path, name],
                message: `Unknown reference prefix "{${prefix}.${key}}". Available prefixes: ${Object.keys(availableKeys).join(', ')}.`,
              });
            } else if (!known.has(key)) {
              ctx.addIssue({
                code: 'custom',
                path: [...path, name],
                message: `Unknown ${prefix} reference "{${prefix}.${key}}". Available keys: ${[...known].join(', ')}.`,
              });
            }
          }
        } else if (value && typeof value === 'object') {
          checkGroup(value as Record<string, unknown>, [...path, name], availableKeys);
        }
      }
    };

    for (const [setName, set] of Object.entries(theme.typography)) {
      const availableKeys: Record<string, Set<string>> = {
        'line-height': new Set(Object.keys(set.lineHeight)),
        'font-weight': new Set(Object.keys(set.fontWeight)),
        'letter-spacing': new Set(Object.keys(set.letterSpacing)),
        'font-size': fontSizeKeys,
      };

      checkGroup(set.components, ['typography', setName, 'components'], availableKeys);
    }
  });

type SharedThemeValue = {
  /** Path to the value within a theme, used for the issue path. */
  path: string[];
  /** Human readable name of the value, used in the issue message. */
  description: string;
  value: unknown;
};

/**
 * The parts of a theme that end up in token sets shared by all themes
 * (`primitives/globals`, `primitives/modes/size/*`, `primitives/modes/typography/size/*`, `semantic/*`),
 * or that decide which token sets exist (the size modes and typography sets in `$themes.json` and `$metadata.json`).
 *
 * `tokens create` writes these sets once per theme to the same path, so the values must be identical across themes.
 * Otherwise the last theme would silently win, or a size mode present in one theme would be missing in another.
 */
const getSharedThemeValues = (theme: ConfigSchemaTheme): SharedThemeValue[] => {
  // The first typography set provides the line-heights, letter-spacings and components shared by all themes.
  // Font-family and font-weights are written per theme, so they are free to differ.
  const [primaryTypographyName = '', primaryTypography] = Object.entries(theme.typography)[0] ?? [];

  return [
    { path: ['size'], description: 'size configuration', value: theme.size },
    { path: ['shadow'], description: 'shadows', value: theme.shadow },
    { path: ['border-width'], description: 'border widths', value: theme['border-width'] },
    { path: ['opacity'], description: 'opacities', value: theme.opacity },
    // The semantic border-radius tokens reference the steps by name and position, while the values are written per theme.
    {
      path: ['borderRadius', 'steps'],
      description: 'border-radius step names',
      value: Object.keys(theme.borderRadius.steps),
    },
    { path: ['typography'], description: 'typography set names', value: Object.keys(theme.typography) },
    {
      path: ['typography', primaryTypographyName, 'lineHeight'],
      description: 'line-heights in the first typography set',
      value: primaryTypography?.lineHeight,
    },
    {
      path: ['typography', primaryTypographyName, 'letterSpacing'],
      description: 'letter-spacings in the first typography set',
      value: primaryTypography?.letterSpacing,
    },
    {
      path: ['typography', primaryTypographyName, 'components'],
      description: 'typography components in the first typography set',
      value: primaryTypography?.components,
    },
  ];
};

export const themesSchema = z
  .record(z.string(), themeSchema)
  // Validate that all themes have the same color names and the same values for everything that ends up in shared token sets.
  // This happens only in runtime i.e. when `validateConfig` is called.
  .superRefine((themes, ctx) => {
    const entries = Object.entries(themes);
    if (entries.length < 2) return;

    const [referenceName, referenceTheme] = entries[0];
    const referenceKeys = new Set(Object.keys(referenceTheme.colors));
    const referenceValues = getSharedThemeValues(referenceTheme);

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

      for (const [index, shared] of getSharedThemeValues(theme).entries()) {
        if (!R.equals(shared.value, referenceValues[index].value)) {
          ctx.addIssue({
            code: 'custom',
            path: [themeName, ...shared.path],
            message: `All themes must define the same ${shared.description}, as they are shared by all themes. Theme "${themeName}" does not match theme "${referenceName}".`,
          });
        }
      }
    }
  })
  .meta({
    description:
      'An object with one or more themes. Each property defines a theme, and the property name is used as the theme name. All themes must define the same color names, size configuration, shadows, border widths, opacities, border-radius step names and typography sets.',
  });

export type ConfigSchemaTheme = z.infer<typeof themeSchema>;
/** The pre-validation shape of a theme, i.e. what users write: defaulted fields are optional. */
export type ConfigSchemaThemeInput = z.input<typeof themeSchema>;

export const configObjectSchema = baseConfigObjectSchema.extend({
  themes: themesSchema,
});

export const configSchema = configObjectSchema.superRefine(warnDeprecatedFields);

export type ConfigSchema = z.infer<typeof configObjectSchema>;

/** The `tokens create` config validated against the internal themes schema. */
export const configFileCreateSchema = baseConfigFileCreateSchema.extend({
  themes: themesSchema,
});

export type CreateConfigSchema = z.infer<typeof configFileCreateSchema>;
/** The pre-validation shape of the config file, i.e. what users write: defaulted fields are optional. */
export type CreateConfigSchemaInput = z.input<typeof configFileCreateSchema>;
