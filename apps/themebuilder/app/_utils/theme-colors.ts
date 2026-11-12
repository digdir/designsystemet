import {
  type ColorScheme,
  type ColorSteps,
  type CssColor,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
  generateColorSchemes,
  getBaseColor,
  getThemeColorScales,
  type SemanticColorNames,
  type SeverityColorNames,
  semanticColorNames,
  severityColors,
} from '@digdir/designsystemet/internal';

type ThemeConfig = NonNullable<ExternalConfigSchemaInput['themes']>[string];
type ConfigInput = Omit<ExternalConfigSchemaInput, 'themes'> & {
  themes?: Record<string, ThemeConfig>;
};

/** The light and dark color of a step. */
type StepColors = { light: CssColor; dark: CssColor };
/** Edited steps of a color, as in the builder's color overrides. */
export type ColorEdits = Partial<
  Record<SemanticColorNames, Partial<StepColors>>
>;

const SCHEMES: ColorScheme[] = ['light', 'dark'];

export const isSeverityColorName = (name: string): name is SeverityColorNames =>
  Object.hasOwn(severityColors, name);

export const isSameColor = (a: string, b: string) =>
  a.toLowerCase() === b.toLowerCase();

/**
 * Every color of a theme with its base color and every step in light and dark, resolved like the CLI does:
 * the scale generated from the base color, then the steps the color sets itself, then the deprecated
 * `overrides.severity` and `overrides.colors`. Includes the default severity colors, last.
 */
function resolveThemeColors(theme: ThemeConfig) {
  // Parsed like the CLI does, which normalizes the hex colors and adds the missing severity colors.
  const parsed = externalConfigSchema.parse({
    themes: { theme: { colors: theme.colors, overrides: theme.overrides } },
  }).themes?.theme;
  if (!parsed) throw new Error('Missing theme');
  const light = getThemeColorScales(parsed, 'light');
  const dark = getThemeColorScales(parsed, 'dark');
  return Object.keys(light).map((name) => {
    // Deprecated `overrides.severity` replaces the whole color
    const severity = isSeverityColorName(name)
      ? parsed.overrides?.severity?.[name]
      : undefined;
    const steps = {} as Record<SemanticColorNames, StepColors>;
    for (const step of semanticColorNames) {
      steps[step] = {
        light: light[name][step].hex,
        dark: dark[name][step].hex,
      };
    }
    return {
      name,
      base: getBaseColor(severity ?? parsed.colors[name]),
      steps,
    };
  });
}

function withoutColorOverrides(overrides: ThemeConfig['overrides']) {
  const { colors: _colors, severity: _severity, ...rest } = overrides ?? {};
  return Object.keys(rest).length > 0 ? rest : undefined;
}

/** The steps that differ from the scale generated from the base color, i.e. the builder's color overrides. */
function editedSteps(
  base: CssColor,
  steps: Record<SemanticColorNames, StepColors>,
): ColorEdits {
  const generated = generateColorSchemes(base);
  const edits: ColorEdits = {};
  for (const step of semanticColorNames) {
    for (const scheme of SCHEMES) {
      const value = steps[step][scheme];
      if (!isSameColor(value, generated[scheme][step].hex)) {
        edits[step] = { ...edits[step], [scheme]: value };
      }
    }
  }
  return edits;
}

/** The steps in the order of the color scale, with the base color in `base-default` light. */
const inScaleOrder = (
  steps: ColorEdits & { 'base-default': { light: CssColor } },
) =>
  Object.fromEntries(
    semanticColorNames.flatMap((step) =>
      steps[step] ? [[step, steps[step]]] : [],
    ),
  ) as ColorSteps;

/**
 * The theme as it is exported: each color as its base color, or, when steps are edited in the builder, as color
 * steps with the base color in `base-default` light and only the edited steps. The severity colors are only
 * included when they aren't the default or have edited steps. The deprecated `overrides.colors` and
 * `overrides.severity` are folded into the colors and left out.
 */
export function exportThemeColors(theme: ThemeConfig): ThemeConfig {
  const colors: ThemeConfig['colors'] = {};
  for (const { name, base, steps } of resolveThemeColors(theme)) {
    const edits = editedSteps(base, steps);
    if (Object.keys(edits).length === 0) {
      if (
        !isSeverityColorName(name) ||
        !isSameColor(base, severityColors[name])
      ) {
        colors[name] = base;
      }
    } else if (edits['base-default']?.light) {
      // `base-default` in light is the base color the other steps are generated from, so editing it would change
      // them too. Every step is written instead, which gives the same colors.
      colors[name] = steps;
    } else {
      colors[name] = inScaleOrder({
        ...edits,
        'base-default': { light: base, ...edits['base-default'] },
      });
    }
  }
  const overrides = withoutColorOverrides(theme.overrides);
  const exported: ThemeConfig = { ...theme, colors, overrides };
  if (!overrides) delete exported.overrides;
  return exported;
}

export function exportConfigColors<T extends ConfigInput>(config: T): T {
  if (!config.themes) return config;
  return {
    ...config,
    themes: Object.fromEntries(
      Object.entries(config.themes).map(([name, theme]) => [
        name,
        exportThemeColors(theme),
      ]),
    ),
  };
}

/**
 * The theme in the builder's compact form, as kept in the URL: each color as its base color, the severity
 * colors that aren't the default in `overrides.severity`, and only the steps that differ from the scale
 * generated from the base color in `overrides.colors` (the builder's color overrides).
 * Accepts colors as hex colors or as color steps, e.g. a full scale exported from the builder.
 */
export function compactThemeColors(theme: ThemeConfig): ThemeConfig {
  const colors: Record<string, CssColor> = {};
  const severity: Partial<Record<SeverityColorNames, CssColor>> = {};
  const edits: Record<string, ColorEdits> = {};

  for (const { name, base, steps } of resolveThemeColors(theme)) {
    if (!isSeverityColorName(name)) {
      colors[name] = base;
    } else if (!isSameColor(base, severityColors[name])) {
      severity[name] = base;
    }
    const colorEdits = editedSteps(base, steps);
    if (Object.keys(colorEdits).length > 0) edits[name] = colorEdits;
  }

  const overrides: NonNullable<ThemeConfig['overrides']> = {
    ...withoutColorOverrides(theme.overrides),
    ...(Object.keys(edits).length > 0 && { colors: edits }),
    ...(Object.keys(severity).length > 0 && { severity }),
  };
  const compact: ThemeConfig = { ...theme, colors, overrides };
  if (Object.keys(overrides).length === 0) delete compact.overrides;
  return compact;
}

export function compactConfigColors<T extends ConfigInput>(config: T): T {
  if (!config.themes) return config;
  return {
    ...config,
    themes: Object.fromEntries(
      Object.entries(config.themes).map(([name, theme]) => [
        name,
        compactThemeColors(theme),
      ]),
    ),
  };
}
