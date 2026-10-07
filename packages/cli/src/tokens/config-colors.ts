import { generateColorScale } from '../colors/scale.ts';
import type { ColorScheme, CssColor, SemanticColorNames, SeverityColorNames } from '../colors/types.ts';
import { severityColors, visitedLinkColor } from '../schemas/defaults.ts';
import type { ExternalConfigSchemaInput } from '../schemas/schema.ts';

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

export type ConfigColors = Pick<ThemeConfig, 'colors' | 'overrides'> & {
  /** What couldn't be included in the config. */
  warnings: string[];
};

const SCHEMES: ColorScheme[] = ['light', 'dark'];

/**
 * The `colors` and `overrides` of the theme config that generated these colors. Each color's base color is its
 * `base-default` in light, which is the input color unchanged; every other step is generated from it, so steps that
 * differ from the generated scale (e.g. ones edited by hand) become overrides. Severity colors, the visited link color
 * and the focus colors are only included when they aren't the defaults, like the theme builder does.
 */
export function configColorsFromValues({
  scales,
  linkVisited,
  focusInner,
  focusOuter,
}: ThemeColorValues): ConfigColors {
  const warnings: string[] = [];
  const colors: Record<string, CssColor> = {};
  const overrides: Overrides = {};

  for (const [colorName, steps] of scales) {
    const base = steps.get('base-default')?.light;
    if (!base) {
      warnings.push(`Color "${colorName}" has no base-default color in light, so it isn't in the config.`);
      continue;
    }

    // Severity colors are always generated, so they are only in the config when they aren't the default.
    if (isSeverityColor(colorName)) {
      if (!isSameColor(base, severityColors[colorName])) {
        overrides.severity = { ...overrides.severity, [colorName]: base };
      }
    } else {
      colors[colorName] = base;
    }

    for (const scheme of SCHEMES) {
      const scale = generateColorScale(base, scheme);
      for (const [stepName, step] of Object.entries(scale) as [
        SemanticColorNames,
        (typeof scale)[SemanticColorNames],
      ][]) {
        const actual = steps.get(stepName)?.[scheme];
        if (actual && !isSameColor(actual, step.hex)) {
          overrides.colors ??= {};
          overrides.colors[colorName] ??= {};
          overrides.colors[colorName][stepName] = { ...overrides.colors[colorName][stepName], [scheme]: actual };
        }
      }
    }
  }

  const linkVisitedOverride = diffFromDefaults(
    linkVisited,
    (scheme) => generateColorScale(visitedLinkColor, scheme)['base-default'].hex,
  );
  if (linkVisitedOverride) {
    overrides.linkVisited = linkVisitedOverride;
  }

  // The focus colors default to neutral's background and text colors, after any overrides,
  // which are the values already in the scales.
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
    colors,
    ...(Object.keys(overrides).length > 0 && { overrides }),
    warnings,
  };
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
  return name in severityColors;
}

function isSameColor(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
