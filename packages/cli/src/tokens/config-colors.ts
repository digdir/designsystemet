import { generateColorScale } from '../colors/scale.ts';
import type { ColorScheme, CssColor, SemanticColorNames, SeverityColorNames } from '../colors/types.ts';
import { severityColors, visitedLinkColor } from '../schemas/defaults.ts';
import type { ExternalConfigSchemaInput } from '../schemas/schema.ts';
import { colorNameSchema } from '../schemas/schema-color.ts';

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
  // Maps, as the color names come from the input: assigning them as object keys could reach Object.prototype
  // through a name like `__proto__`. They become objects with Object.fromEntries, which only adds own properties.
  const colors = new Map<string, CssColor>();
  const severity = new Map<SeverityColorNames, CssColor>();
  const colorOverrides = new Map<string, Map<SemanticColorNames, SchemeColors>>();
  const overrides: Overrides = {};

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

    // Severity colors are always generated, so they are only in the config when they aren't the default.
    if (isSeverityColor(colorName)) {
      if (!isSameColor(base, severityColors[colorName])) {
        severity.set(colorName, base);
      }
    } else {
      colors.set(colorName, base);
    }

    for (const scheme of SCHEMES) {
      const scale = generateColorScale(base, scheme);
      const missing: SemanticColorNames[] = [];
      for (const [stepName, step] of Object.entries(scale) as [
        SemanticColorNames,
        (typeof scale)[SemanticColorNames],
      ][]) {
        const actual = steps.get(stepName)?.[scheme];
        if (!actual) {
          missing.push(stepName);
        } else if (!isSameColor(actual, step.hex)) {
          const stepOverrides = colorOverrides.get(colorName) ?? new Map<SemanticColorNames, SchemeColors>();
          colorOverrides.set(colorName, stepOverrides);
          stepOverrides.set(stepName, { ...stepOverrides.get(stepName), [scheme]: actual });
        }
      }
      // A missing step, e.g. a variable deleted in Figma, can't be an override, so the config generates it.
      if (missing.length > 0) {
        warnings.push(missingStepsWarning(colorName, scheme, missing, Object.keys(scale).length));
      }
    }
  }

  if (colorOverrides.size > 0) {
    overrides.colors = Object.fromEntries(
      [...colorOverrides].map(([colorName, stepOverrides]) => [colorName, Object.fromEntries(stepOverrides)]),
    );
  }
  if (severity.size > 0) {
    overrides.severity = Object.fromEntries(severity);
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
    colors: Object.fromEntries(colors),
    ...(Object.keys(overrides).length > 0 && { overrides }),
    warnings,
  };
}

function missingStepsWarning(
  colorName: string,
  scheme: ColorScheme,
  missing: SemanticColorNames[],
  stepCount: number,
): string {
  const generates = 'so importing the config generates';
  if (missing.length === stepCount) {
    return `Color "${colorName}" has no colors in ${scheme}, ${generates} them from the base color.`;
  }
  if (missing.length === stepCount - 1 && !missing.includes('base-default')) {
    return `Color "${colorName}" has only its base color in ${scheme}, ${generates} the rest from it.`;
  }
  return `Color "${colorName}" has no ${missing.join(', ')} in ${scheme}, ${generates} ${missing.length === 1 ? 'it' : 'them'} from the base color.`;
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
