import * as R from 'ramda';
import { z } from 'zod';
import { borderRadiusNumberSchema, borderRadiusSchema } from './schema-border-radius.ts';
import { borderWidthSchema } from './schema-border-width.ts';
import { colorsSchema } from './schema-color.ts';
import { opacitySchema } from './schema-opacity.ts';
import { outputConfigShape } from './schema-output.ts';
import { overridesSchema } from './schema-overrides.ts';
import { shadowSchema } from './schema-shadow.ts';
import { sizeSchema } from './schema-size.ts';
import { typographySchema, typographyShorthandSchema } from './schema-typography.ts';

/** The plain theme object. Use this when you need `.shape` or `.pick()`; use {@link themeSchema} to validate a theme. */
const themeObjectSchema = z
  .object({
    colors: colorsSchema,
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
        for (const [, reference] of value.matchAll(/\{([\w.-]+)\}/g)) {
          const [prefix, ...rest] = reference.split('.');
          const key = rest.join('.');
          if (key === '') {
            // The only single-segment reference is the theme's own font-family.
            if (prefix !== 'font-family') {
              ctx.addIssue({
                code: 'custom',
                path: [...path, name],
                message: `Unknown reference "{${prefix}}". The only single-segment reference is "{font-family}"; other references must be prefixed, e.g. "{font-size.3}". Available prefixes: ${Object.keys(availableKeys).join(', ')}.`,
              });
            }
            continue;
          }
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

/**
 * Validate that there is at least one theme, and that all themes define the same color names.
 * The semantic color token sets are generated once and shared by all themes, so a color present
 * in one theme but not another would have no tokens there.
 * Used by both the full and the public `themes` schema.
 */
const checkThemes = (themes: Record<string, { colors: Record<string, unknown> }>, ctx: z.RefinementCtx) => {
  const entries = Object.entries(themes);
  if (entries.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'At least one theme must be defined.' });
    return;
  }
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
};

export const themesSchema = z
  .record(z.string(), themeSchema)
  // Validate that all themes have the same color names and the same values for everything that ends up in shared token sets.
  // This happens only in runtime i.e. when `validateConfig` is called.
  .superRefine((themes, ctx) => {
    checkThemes(themes, ctx);

    const entries = Object.entries(themes);
    if (entries.length < 2) return;

    const [referenceName, referenceTheme] = entries[0];
    const referenceValues = getSharedThemeValues(referenceTheme);

    for (const [themeName, theme] of entries.slice(1)) {
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

/** The full config schema with every field the CLI understands, used to validate a config file. */
export const configSchema = z.object({
  ...outputConfigShape,
  themes: themesSchema,
});

export type ConfigSchema = z.infer<typeof configSchema>;

export type ConfigSchemaInput = z.input<typeof configSchema>;

/**
 * The theme keys that are part of the public config. Everything else in {@link themeObjectSchema} is internal
 * until it is added here. `pick` fails to compile if a key listed here is removed from the theme.
 */
const externalThemeMask = {
  colors: true,
  typography: true,
  borderRadius: true,
  overrides: true,
} as const;

/**
 * A theme restricted to the keys and shapes of the public config, without the internal-only cross-key refinements.
 * Typography is limited to the `{ fontFamily }` shorthand and border-radius to a number, as the public config
 * has no named typography sets or border-radius steps. Strict, so internal-only and misspelled keys are
 * rejected instead of silently stripped.
 */
const externalThemeSchema = themeObjectSchema
  .pick(externalThemeMask)
  .extend({
    typography: typographyShorthandSchema,
    borderRadius: borderRadiusNumberSchema,
  })
  .strict()
  .meta({ description: 'An object defining a theme. The property name holding the object becomes the theme name.' });

/**
 * The public config: {@link configSchema} without `output`, and with themes restricted to the public keys.
 * Use this when exposing the schema externally (the public JSON schema, the theme builder and the Figma plugin);
 * use {@link configSchema} to validate a config in the CLI.
 */
export const externalConfigSchema = configSchema.omit({ output: true }).extend({
  themes: z.record(z.string(), externalThemeSchema).superRefine(checkThemes).meta({
    description:
      'An object with one or more themes. Each property defines a theme, and the property name is used as the theme name. All themes must define the same color names.',
  }),
});

export type ExternalConfigSchema = z.infer<typeof externalConfigSchema>;
/** The pre-validation shape of the public config, i.e. what users write: defaulted fields are optional. */
export type ExternalConfigSchemaInput = z.input<typeof externalConfigSchema>;
