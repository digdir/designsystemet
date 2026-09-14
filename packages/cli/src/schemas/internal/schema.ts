import * as R from 'ramda';
import { z } from 'zod';
import { convertToHex } from '../../colors/index.ts';
import { overridesSchema } from '../v1.1/schema.ts';
import { configObjectSchema as baseConfigObjectSchema, warnDeprecatedFields } from '../v1.2/schema.ts';
import { borderRadiusSchema } from './schema-border-radius.ts';
import { borderWidthSchema } from './schema-border-width.ts';
import { opacitySchema } from './schema-opacity.ts';
import { shadowSchema } from './schema-shadow.ts';
import { sizeSchema } from './schema-size.ts';
import { typographySchema, typographyShorthandSchema } from './schema-typography.ts';

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

// Color names end up in token paths, CSS variables and class names, so they are restricted to
// lowercase letters, digits and hyphens. Matches the sanitizing done by the theme builder.
const colorNameSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, {
    message: 'Color names may only contain lowercase letters (a-z), digits (0-9) and hyphens (-).',
  })
  .describe('The name of a color, used in token paths and CSS variables.');

/** The plain theme object. Use this when you need `.shape` or `.pick()`; use {@link themeSchema} to validate a theme. */
const themeObjectSchema = z
  .object({
    colors: z
      .record(colorNameSchema, colorSchema)
      .refine((c) => typeof (c as Record<string, unknown>).neutral === 'string', {
        message: 'Theme colors must include a "neutral" color.',
      })
      .meta({ description: 'Defines the colors for this theme' }),
    typography: typographySchema,
    size: sizeSchema,
    borderRadius: borderRadiusSchema,
    overrides: overridesSchema,
    borderWidth: borderWidthSchema,
    shadow: shadowSchema,
    opacity: opacitySchema,
  })
  .meta({ description: 'An object defining a theme. The property name holding the object becomes the theme name.' });

// Validate that every size step has typography values, and that token references in the typography
// components (e.g. '{letter-spacing.3}') point to keys defined in this theme.
const themeSchema = themeObjectSchema.superRefine((theme, ctx) => {
  const stepNames = Object.keys(theme.size.steps);
  const missingSteps = stepNames.filter((step) => !(step in theme.typography.size));
  if (missingSteps.length > 0) {
    ctx.addIssue({
      code: 'custom',
      path: ['typography', 'size'],
      message: `Missing typography for size step(s): ${missingSteps.join(', ')}. Every step in "size.steps" needs an entry in "typography.size".`,
    });
  }

  // References must resolve in every size mode, so only keys present in all modes count.
  // Steps without typography are reported above and left out here, falling back to all defined modes,
  // so a missing step does not also flag every reference in the components.
  const stepModes = stepNames.map((step) => theme.typography.size[step]).filter((mode) => mode !== undefined);
  const modes = stepModes.length > 0 ? stepModes : Object.values(theme.typography.size);
  const sharedKeys = (group: 'lineHeight' | 'letterSpacing' | 'fontSize') => {
    const keys = new Set<string>();
    for (const key of Object.keys(modes[0]?.[group] ?? {})) {
      if (modes.every((mode) => key in mode[group])) {
        keys.add(key);
      }
    }
    return keys;
  };

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

  // The components and size-mode typography are shared by all typography sets,
  // while each set writes its own font-weights, so only font-weight keys present in every set can be referenced.
  const fonts = Object.values(theme.typography.fonts);
  const fontWeightKeys = new Set<string>();
  for (const key of Object.keys(fonts[0]?.fontWeight ?? {})) {
    if (fonts.every((font) => key in font.fontWeight)) {
      fontWeightKeys.add(key);
    }
  }

  const availableKeys: Record<string, Set<string>> = {
    'line-height': sharedKeys('lineHeight'),
    'font-weight': fontWeightKeys,
    'letter-spacing': sharedKeys('letterSpacing'),
    'font-size': sharedKeys('fontSize'),
  };

  checkGroup(theme.typography.components, ['typography', 'components'], availableKeys);
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
  // Size-mode typography and components are shared by all typography sets and themes.
  // Font-family and font-weights are written per theme, so they are free to differ.
  return [
    { path: ['size'], description: 'size configuration', value: theme.size },
    { path: ['shadow'], description: 'shadows', value: theme.shadow },
    { path: ['borderWidth'], description: 'border widths', value: theme.borderWidth },
    { path: ['opacity'], description: 'opacities', value: theme.opacity },
    // The semantic border-radius tokens reference the steps by name and position, while the values are written per theme.
    {
      path: ['borderRadius', 'steps'],
      description: 'border-radius step names',
      value: Object.keys(theme.borderRadius.steps),
    },
    { path: ['typography', 'fonts'], description: 'typography set names', value: Object.keys(theme.typography.fonts) },
    { path: ['typography', 'size'], description: 'size-mode typography', value: theme.typography.size },
    {
      path: ['typography', 'components'],
      description: 'typography components',
      value: theme.typography.components,
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

/** The theme keys that exist in the public v1.2 config. `satisfies` fails to compile if the v1.2 theme keys change. */
const externalThemeMask = {
  colors: true,
  typography: true,
  borderRadius: true,
  overrides: true,
} satisfies Record<keyof z.infer<typeof baseConfigObjectSchema>['themes'][string], true>;

/**
 * A theme restricted to the keys and shapes available in the v1.2 config, without the internal-only cross-key refinements.
 * Typography is limited to the `{ fontFamily }` shorthand, as v1.2 has no named typography sets.
 */
const externalThemeSchema = themeObjectSchema.pick(externalThemeMask).extend({
  typography: typographyShorthandSchema,
});

/**
 * The config with themes restricted to the keys available in the v1.2 config.
 * Use this when exposing the schema externally (e.g. the public JSON schema); use {@link configSchema} to validate a config.
 */
export const externalConfigSchema = configObjectSchema.extend({
  themes: z.record(z.string(), externalThemeSchema).meta({
    description:
      'An object with one or more themes. Each property defines a theme, and the property name is used as the theme name.',
  }),
});

export type ConfigSchema = z.infer<typeof configObjectSchema>;
