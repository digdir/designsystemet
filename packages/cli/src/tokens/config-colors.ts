import { generateColorScale } from '../colors/scale.ts';
import { semanticColorNames } from '../colors/specs.ts';
import type { ColorScheme, CssColor, SemanticColorNames, SeverityColorNames } from '../colors/types.ts';
import { severityColors, visitedLinkColor } from '../schemas/defaults.ts';
import type { ExternalConfigSchemaInput } from '../schemas/schema.ts';
import { type ColorSteps, colorNameSchema } from '../schemas/schema-color.ts';

type ThemeConfig = NonNullable<ExternalConfigSchemaInput['themes']>[string];
type Overrides = NonNullable<ThemeConfig['overrides']>;

/** A color in each color scheme. A scheme is left out when the source doesn't have it. */
export type SchemeColors = Partial<Record<ColorScheme, CssColor>>;

/** A theme's generated colors, e.g. read back from built CSS or from Figma variables. */
export type ThemeColorValues = {
  /** The steps of each color, by color name in config order, e.g. `accent` → `base-default` → { light, dark }. */
  scales: Map<string, Map<SemanticColorNames, SchemeColors>>;
  linkVisited?: SchemeColors;
  focusInner?: SchemeColors;
  focusOuter?: SchemeColors;
};

export type ConfigColors = {
  /**
   * Each color by color name: its base color, or, when steps differ from the scale generated from it, its color
   * steps with the base color and only the steps that differ, e.g. `accent` → `text-default` → { dark }.
   */
  colors: Record<string, CssColor | ColorSteps>;
  /** The visited link and focus colors that aren't the defaults. Colors are never overrides. */
  overrides?: Pick<Overrides, 'linkVisited' | 'focus'>;
  /** What couldn't be included in the config. */
  warnings: string[];
};

const SCHEMES: ColorScheme[] = ['light', 'dark'];

/**
 * The `colors` and `overrides` of the theme config that generated these colors. Each color's base color is its
 * `base-default` in light, which the rest of its scale is generated from. A color is written as its base color, or,
 * when steps differ from the generated scale (e.g. ones edited by hand), as color steps with the base color and only
 * the steps that differ. Severity colors are only included when they aren't the default, and the visited link color
 * and the focus colors only when they aren't the defaults, like the theme builder does.
 */
export function configColorsFromValues({
  scales,
  linkVisited,
  focusInner,
  focusOuter,
}: ThemeColorValues): ConfigColors {
  const warnings: string[] = [];
  // A Map, as the color names come from the input: assigning them as object keys could reach Object.prototype
  // through a name like `__proto__`. It becomes an object with Object.fromEntries, which only adds own properties.
  const colors = new Map<string, CssColor | ColorSteps>();
  const overrides: Pick<Overrides, 'linkVisited' | 'focus'> = {};

  for (const [colorName, steps] of scales) {
    if (!colorNameSchema.safeParse(colorName).success) {
      warnings.push(`Color "${colorName}" isn't a valid color name (only a-z, 0-9 and -), so it isn't in the config.`);
      continue;
    }

    const base = steps.get('base-default')?.light;
    if (!base) {
      warnings.push(`Color "${colorName}" has no base-default color in light, so it isn't in the config.`);
      continue;
    }

    // A missing step, e.g. a variable deleted in Figma, is left out of the color, so the config generates it.
    for (const scheme of SCHEMES) {
      const missing = semanticColorNames.filter((stepName) => !steps.get(stepName)?.[scheme]);
      if (missing.length > 0) {
        warnings.push(missingStepsWarning(colorName, scheme, missing));
      }
    }

    const changed = changedSteps(steps, base);
    // Severity colors are always generated, so they are only in the config when they aren't the default.
    if (isSeverityColor(colorName) && isSameColor(base, severityColors[colorName]) && changed.size === 0) {
      continue;
    }
    colors.set(colorName, changed.size === 0 ? base : toColorSteps(changed, base));
  }

  // A missing value, e.g. a variable deleted in Figma, can't be an override, so the config uses the default.
  for (const [label, values] of [
    ['visited link color', linkVisited],
    ['inner focus color', focusInner],
    ['outer focus color', focusOuter],
  ] as const) {
    const missing = SCHEMES.filter((scheme) => !values?.[scheme]);
    if (missing.length > 0) {
      warnings.push(`The ${label} has no value in ${missing.join(' and ')}, so importing the config uses the default.`);
    }
  }

  const linkVisitedOverride = diffFromDefaults(
    linkVisited,
    (scheme) => generateColorScale(visitedLinkColor, scheme)['base-default'].hex,
  );
  if (linkVisitedOverride) {
    overrides.linkVisited = linkVisitedOverride;
  }

  // The focus colors default to neutral's background and text colors, which are the values already in the scales.
  const neutral = scales.get('neutral');
  const focusInnerOverride = diffFromDefaults(focusInner, (scheme) => neutral?.get('background-default')?.[scheme]);
  const focusOuterOverride = diffFromDefaults(focusOuter, (scheme) => neutral?.get('text-default')?.[scheme]);
  if (focusInnerOverride || focusOuterOverride) {
    overrides.focus = {
      ...(focusInnerOverride && { inner: focusInnerOverride }),
      ...(focusOuterOverride && { outer: focusOuterOverride }),
    };
  }

  return {
    colors: Object.fromEntries(colors),
    ...(Object.keys(overrides).length > 0 && { overrides }),
    warnings,
  };
}

/** The steps as a color in the config, in step order, with the base color in `base-default` light. */
function toColorSteps(steps: Map<SemanticColorNames, SchemeColors>, base: CssColor): ColorSteps {
  // Step names are the fixed spec names, never input, so they are safe as object keys.
  const colorSteps: Partial<Record<SemanticColorNames, SchemeColors>> = {};
  for (const stepName of semanticColorNames) {
    const step: SchemeColors = {};
    for (const scheme of SCHEMES) {
      const color = steps.get(stepName)?.[scheme];
      if (color) {
        step[scheme] = color;
      }
    }
    if (Object.keys(step).length > 0) {
      colorSteps[stepName] = step;
    }
  }
  // `base-default` in light is always set, as it's the base color.
  return { ...colorSteps, 'base-default': { ...colorSteps['base-default'], light: base } } as ColorSteps;
}

/** The steps and schemes that differ from the scale generated from the base color. Missing steps don't. */
function changedSteps(
  steps: Map<SemanticColorNames, SchemeColors>,
  base: CssColor,
): Map<SemanticColorNames, SchemeColors> {
  const changed = new Map<SemanticColorNames, SchemeColors>();
  for (const scheme of SCHEMES) {
    const scale = generateColorScale(base, scheme);
    for (const stepName of semanticColorNames) {
      const actual = steps.get(stepName)?.[scheme];
      if (actual !== undefined && !isSameColor(actual, scale[stepName].hex)) {
        changed.set(stepName, { ...changed.get(stepName), [scheme]: actual });
      }
    }
  }
  return changed;
}

function missingStepsWarning(colorName: string, scheme: ColorScheme, missing: SemanticColorNames[]): string {
  const generated = 'importing the config generates them from the base color';
  if (missing.length === semanticColorNames.length) {
    return `Color "${colorName}" has no colors in ${scheme}, so they're left out of the config, and ${generated}.`;
  }
  if (missing.length === semanticColorNames.length - 1 && !missing.includes('base-default')) {
    return `Color "${colorName}" has only its base color in ${scheme}, so the other steps are left out of the config, and ${generated}.`;
  }
  if (missing.length === 1) {
    return `Color "${colorName}" has no ${missing[0]} in ${scheme}, so it's left out of the config, and importing the config generates it from the base color.`;
  }
  return `Color "${colorName}" has no ${missing.join(', ')} in ${scheme}, so they're left out of the config, and ${generated}.`;
}

/** The colors that differ from their defaults, or undefined if none do. */
function diffFromDefaults(
  values: SchemeColors | undefined,
  getDefault: (scheme: ColorScheme) => CssColor | undefined,
): SchemeColors | undefined {
  const diff: SchemeColors = {};
  for (const scheme of SCHEMES) {
    const actual = values?.[scheme];
    const fallback = getDefault(scheme);
    if (actual && (!fallback || !isSameColor(actual, fallback))) {
      diff[scheme] = actual;
    }
  }
  return Object.keys(diff).length > 0 ? diff : undefined;
}

function isSeverityColor(name: string): name is SeverityColorNames {
  // Own properties only, so names every object has, like `constructor`, aren't severity colors.
  return Object.hasOwn(severityColors, name);
}

function isSameColor(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
