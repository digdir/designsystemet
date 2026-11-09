import {
  type ExternalConfigSchemaInput as ConfigSchema,
  type CssColor,
  getBaseColor,
  getColorSteps,
  severityColors,
} from '@digdir/designsystemet/internal';
import {
  type ColorEdits,
  isSameColor,
  isSeverityColorName,
} from './theme-colors';

const QUERY_SEPARATOR = ' ';

type ThemeConfig = NonNullable<ConfigSchema['themes']>[string];

/**
 * Converts a theme config object to a themebuilder URL with query parameters.
 *
 * Colors can be hex colors or color steps. A color's base color goes in `colors` (or `severity` for the
 * severity colors), and the steps it sets become color overrides, so they show in the color overrides panel.
 * The deprecated `overrides.severity` and `overrides.colors` are applied on top, like the CLI does.
 */
export function configThemeToUrl(
  theme: Pick<ThemeConfig, 'colors' | 'overrides' | 'borderRadius'>,
  lang = 'no',
): string {
  const params = new URLSearchParams();
  const colors: string[] = [];
  const severity: string[] = [];
  const edits: Record<string, ColorEdits> = {};
  const legacySeverity: Partial<Record<string, string>> =
    theme.overrides?.severity ?? {};

  const addEdits = (name: string, steps: ColorEdits) => {
    for (const [step, modes] of Object.entries(steps) as [
      keyof ColorEdits,
      ColorEdits[keyof ColorEdits],
    ][]) {
      if (!modes?.light && !modes?.dark) continue;
      edits[name] ??= {};
      edits[name][step] = {
        ...edits[name][step],
        ...(modes.light && { light: modes.light }),
        ...(modes.dark && { dark: modes.dark }),
      };
    }
  };

  for (const [name, color] of Object.entries(theme.colors ?? {})) {
    // Deprecated `overrides.severity` replaces the whole color, including its steps
    const definition = legacySeverity[name] ?? color;
    const base = getBaseColor(definition as CssColor);
    if (!isSeverityColorName(name)) {
      colors.push(`${name}:${base}`);
    } else if (!isSameColor(base, severityColors[name])) {
      severity.push(`${name}:${base}`);
    }
    const steps = getColorSteps(definition as CssColor);
    if (steps) {
      // `base-default` in light is the base color itself, so it isn't an override
      const { light: _base, ...baseDefault } = steps['base-default'];
      addEdits(name, { ...steps, 'base-default': baseDefault } as ColorEdits);
    }
  }

  for (const [name, hex] of Object.entries(legacySeverity)) {
    if (
      hex &&
      isSeverityColorName(name) &&
      !Object.hasOwn(theme.colors ?? {}, name) &&
      !isSameColor(hex, severityColors[name])
    ) {
      severity.push(`${name}:${hex}`);
    }
  }

  for (const [name, steps] of Object.entries(theme.overrides?.colors ?? {})) {
    addEdits(name, steps as ColorEdits);
  }

  // Convert colors (a flat record of name -> hex, including the reserved `neutral`)
  if (colors.length > 0) params.set('colors', colors.join(QUERY_SEPARATOR));

  // Convert severity colors if overridden
  if (severity.length > 0)
    params.set('severity', severity.join(QUERY_SEPARATOR));

  // Convert color overrides to URL params
  // patterns: <colorname>|<tokenname>|<mode>:<hex>
  const colorOverrides = Object.entries(edits).flatMap(([colorName, steps]) =>
    Object.entries(steps).map(([tokenName, modes]) => {
      let paramStr = `${colorName}|${tokenName}`;
      if (modes?.light) paramStr += `|light:${modes.light}`;
      if (modes?.dark) paramStr += `|dark:${modes.dark}`;
      return paramStr;
    }),
  );
  if (colorOverrides.length > 0) {
    params.set('color-overrides', colorOverrides.join(QUERY_SEPARATOR));
  }

  // Convert border radius
  if (theme.borderRadius !== undefined) {
    params.set('border-radius', theme.borderRadius.toString());
  }

  // Set default appearance
  params.set('appearance', 'light');
  params.set('tab', 'colorsystem');

  return `/${lang}?${params.toString()}`;
}
