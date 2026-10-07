import postcss from 'postcss';
import pkg from '../../package.json' with { type: 'json' };
import { semanticColorNames } from '../colors/specs.ts';
import type { ColorScheme, CssColor, SemanticColorNames } from '../colors/types.ts';
import { defaultBorderRadius, defaultFontFamily } from '../schemas/defaults.ts';
import { validateConfig } from '../schemas/helpers.ts';
import { type ExternalConfigSchemaInput, externalConfigSchema } from '../schemas/schema.ts';
import { configColorsFromValues, type SchemeColors, type ThemeColorValues } from '../tokens/config-colors.ts';

type ThemeConfig = NonNullable<ExternalConfigSchemaInput['themes']>[string];

export type GeneratedConfigFromCSS = {
  config: ExternalConfigSchemaInput;
  /** What is in the CSS but can't be described by the config, and so is left out of it. */
  warnings: string[];
};

// The layers `tokens build` writes each color scheme's colors to, e.g. `ds.theme.color-scheme.light`.
const COLOR_SCHEME_LAYER = /^ds\.theme\.color-scheme\.(light|dark)$/;
// The layers each typography set's font family is in, e.g. `ds.theme.typography.primary`.
const TYPOGRAPHY_LAYER = /^ds\.theme\.typography\.(.+)$/;
const HEX_COLOR = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
// Longest first, so a color's step is matched by its full name.
const STEP_NAMES = [...semanticColorNames].sort((a, b) => b.length - a.length);
const OTHER_COLORS: Record<string, keyof Omit<ThemeColorValues, 'scales'>> = {
  '--ds-link-color-visited': 'linkVisited',
  '--ds-color-focus-inner': 'focusInner',
  '--ds-color-focus-outer': 'focusOuter',
};

/**
 * Creates the config that theme CSS files built by `tokens build` (e.g. `designsystemet.css`) came from.
 * Each file is one theme, keyed by theme name, which is the file name without `.css`.
 *
 * Only what the public config can describe is read: the colors (each color's base color, with steps that differ
 * from the generated scale as overrides), the font family and the border radius. Values that match the defaults
 * are left out, like the theme builder does. Throws if a file isn't theme CSS, or if the config isn't valid.
 */
export function generateConfigFromCSS(themes: Record<string, string>): GeneratedConfigFromCSS {
  const warnings: string[] = [];
  const config: ExternalConfigSchemaInput = { themes: {} };

  for (const [themeName, css] of Object.entries(themes)) {
    const theme = readThemeCSS(themeName, css);
    const { warnings: themeWarnings, ...themeConfig } = theme;
    config.themes = { ...config.themes, [themeName]: themeConfig };
    warnings.push(...themeWarnings.map((warning) => `Theme "${themeName}": ${warning}`));
  }

  validateConfig(externalConfigSchema, config);

  return { config, warnings };
}

function readThemeCSS(themeName: string, css: string): ThemeConfig & { warnings: string[] } {
  const warnings: string[] = [];
  const root = postcss.parse(css);

  const colorValues: ThemeColorValues = { scales: new Map() };
  const schemes = new Set<ColorScheme>();
  const fontFamilies = new Map<string, string>();
  let borderRadius: string | undefined;
  let buildVersion: string | undefined;

  root.walkAtRules('layer', (layer) => {
    const scheme = COLOR_SCHEME_LAYER.exec(layer.params)?.[1] as ColorScheme | undefined;
    if (scheme) {
      schemes.add(scheme);
      // Only the rules directly in the layer. The `prefers-color-scheme` media queries in it repeat the same values.
      layer.each((rule) => {
        if (rule.type !== 'rule') return;
        rule.each((decl) => {
          if (decl.type !== 'decl') return;
          const warning = readColor(colorValues, scheme, decl.prop, decl.value);
          if (warning) warnings.push(warning);
        });
      });
    }

    const typographySet = TYPOGRAPHY_LAYER.exec(layer.params)?.[1];
    if (typographySet) {
      layer.walkDecls('--ds-font-family', (decl) => {
        fontFamilies.set(typographySet, toFontFamily(decl.value));
      });
    }
  });

  root.walkDecls('--ds-border-radius-base', (decl) => {
    borderRadius ??= decl.value;
  });

  // `tokens build` writes the version it was built with in a header comment, e.g. `build: v1.23.0`.
  root.walkComments((comment) => {
    buildVersion ??= /\bbuild: v(\S+)/.exec(comment.text)?.[1];
  });

  if (!schemes.has('light')) {
    throw new Error(
      `Theme "${themeName}" isn't theme CSS built by Designsystemet: it has no "ds.theme.color-scheme.light" layer.`,
    );
  }

  if (buildVersion && buildVersion !== pkg.version) {
    warnings.push(
      `The CSS was built with v${buildVersion}, and this is v${pkg.version}. Colors the two versions generate differently are kept as overrides.`,
    );
  }

  const { colors, overrides, warnings: colorWarnings } = configColorsFromValues(colorValues);
  warnings.push(...colorWarnings);

  return {
    colors,
    ...(overrides && { overrides }),
    ...readTypography(fontFamilies, warnings),
    ...readBorderRadius(borderRadius, warnings),
    warnings,
  };
}

/** Adds a color declaration to the values. Returns a warning if it's a color that can't be read. */
function readColor(values: ThemeColorValues, scheme: ColorScheme, prop: string, value: string): string | undefined {
  const other = OTHER_COLORS[prop];
  const [, name = ''] = /^--ds-color-(.+)$/.exec(prop) ?? [];
  const step = other ? undefined : STEP_NAMES.find((step) => name.endsWith(`-${step}`));
  if (!other && !step) {
    return undefined;
  }

  if (!HEX_COLOR.test(value)) {
    return `${prop} in ${scheme} isn't a hex color (${value}), so it isn't in the config.`;
  }
  const color = value as CssColor;

  if (other) {
    values[other] = { ...values[other], [scheme]: color };
  } else if (step) {
    const colorName = name.slice(0, -(step.length + 1));
    const steps = values.scales.get(colorName) ?? new Map<SemanticColorNames, SchemeColors>();
    values.scales.set(colorName, steps);
    steps.set(step, { ...steps.get(step), [scheme]: color });
  }
  return undefined;
}

// The config has one font family for every typography set, so it is the primary set's.
function readTypography(fontFamilies: Map<string, string>, warnings: string[]): Pick<ThemeConfig, 'typography'> {
  const [primarySet, fontFamily] = fontFamilies.has('primary')
    ? ['primary', fontFamilies.get('primary')]
    : ([...fontFamilies][0] ?? []);
  if (!fontFamily) {
    return {};
  }

  for (const [set, other] of fontFamilies) {
    if (other !== fontFamily) {
      warnings.push(
        `Typography set "${set}" uses font family ${other}, but the config has one font family for every set, so ${fontFamily} from "${primarySet}" is used.`,
      );
    }
  }

  return fontFamily === defaultFontFamily ? {} : { typography: { fontFamily } };
}

// `tokens build` writes the border radius in rem, from the config's px with a 16px root font size.
function readBorderRadius(value: string | undefined, warnings: string[]): Pick<ThemeConfig, 'borderRadius'> {
  if (value === undefined) {
    return {};
  }

  // No two parts of the number can match the same digits, so a long value doesn't make the matching slow.
  const [, number, unit] = /^(\d+(?:\.\d+)?|\.\d+)(rem|px)?$/.exec(value.trim()) ?? [];
  if (number === undefined) {
    warnings.push(
      `--ds-border-radius-base isn't a length the config can describe (${value}), so it isn't in the config.`,
    );
    return {};
  }

  const borderRadius = unit === 'rem' ? Number(number) * 16 : Number(number);
  return borderRadius === defaultBorderRadius ? {} : { borderRadius };
}

/** The first family in a font-family value, without quotes, e.g. `'IBM Plex Sans', sans-serif` → `IBM Plex Sans`. */
function toFontFamily(value: string): string {
  return value
    .split(',')[0]
    .trim()
    .replace(/^(['"])(.*)\1$/, '$2');
}
