import pc from 'picocolors';
import { z } from 'zod';
import { semanticColorNames } from '../colors/specs.ts';
import { severityColorNames } from './defaults.ts';
import { colorSchema } from './schema-color.ts';

const colorModeOverrideSchema = z
  .object({
    light: colorSchema.optional().describe('A hex color that overrides light mode'),
    dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
  })
  .describe('Override values for semantic color tokens like "background-subtle", "border-default", etc.');

const colorWeightOverrideSchema = z
  .partialRecord(z.enum([...semanticColorNames]), colorModeOverrideSchema)
  .describe('The name of the color to add overrides for, e.g. "accent"');

const semanticColorOverrideSchema = z.record(z.string(), colorWeightOverrideSchema).meta({
  description:
    'Deprecated: set the color steps on the color in "colors" instead, e.g. "accent": { "base-default": { "light": "#0062BA" }, "border-default": { "dark": "#..." } }. An object with color names as keys',
  deprecated: true,
  // Non-standard JSON schema keyword, shown by VS Code instead of a generic deprecation warning
  deprecationMessage: 'Set the color steps on the color in "colors" instead.',
});

const severityColorOverrideSchema = z
  .partialRecord(
    z.enum(severityColorNames),
    colorSchema.describe('A hex color, which is used for creating a color scale'),
  )
  .optional()
  .meta({
    description:
      'Deprecated: set the severity color in "colors" instead, e.g. "danger": "#C01B1B". An object with severity color names as keys',
    deprecated: true,
    deprecationMessage: 'Set the severity color in "colors" instead.',
  });

const linkVisitedOverrideSchema = z
  .object({
    light: colorSchema.optional().describe('A hex color that overrides light mode'),
    dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
  })
  .meta({
    description: 'Deprecated: style .ds-link:visited instead. Overrides for the "link-visited" color',
    deprecated: true,
    // Non-standard JSON schema keyword, shown by VS Code instead of a generic deprecation warning
    deprecationMessage: 'Style .ds-link:visited instead.',
  });

const focusOverrideSchema = z
  .object({
    inner: z
      .object({
        light: colorSchema.optional().describe('A hex color that overrides light mode'),
        dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
      })
      .optional()
      .describe('Overrides for the "focus-inner" color'),
    outer: z
      .object({
        light: colorSchema.optional().describe('A hex color that overrides light mode'),
        dark: colorSchema.optional().describe('A hex color that overrides dark mode'),
      })
      .optional()
      .describe('Overrides for the "focus-outer" color'),
  })
  .describe('Overrides for the focus colors');

export const overridesSchema = z
  .object({
    colors: semanticColorOverrideSchema.optional(),
    severity: severityColorOverrideSchema.optional(),
    linkVisited: linkVisitedOverrideSchema.optional(),
    focus: focusOverrideSchema.optional(),
  })
  .describe('Overrides for generated design tokens. Currently only supports colors defined in your theme')
  .optional();

export type ColorOverrideSchema = z.infer<typeof overridesSchema>;

const deprecatedOverrides = {
  colors: 'set the color steps on the color in "colors" instead',
  severity: 'set the severity color in "colors" instead',
} as const;

/** Non-fatal: warn about the deprecated `overrides.colors` and `overrides.severity` in a config file's themes. */
export const warnDeprecatedOverrides = (config: { themes?: unknown }) => {
  const themes = typeof config.themes === 'object' && config.themes !== null ? Object.entries(config.themes) : [];
  for (const [key, instead] of Object.entries(deprecatedOverrides)) {
    const themeNames = themes
      .filter(([, theme]) => (theme as { overrides?: Record<string, unknown> } | null)?.overrides?.[key] !== undefined)
      .map(([name]) => `"${name}"`);
    if (themeNames.length > 0) {
      console.warn(
        pc.yellow(
          `⚠️  Config field "overrides.${key}" (in theme${themeNames.length > 1 ? 's' : ''} ${themeNames.join(', ')}) is deprecated and will be removed in a future release; ${instead}.`,
        ),
      );
    }
  }
};
