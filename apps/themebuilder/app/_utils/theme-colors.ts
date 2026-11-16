import {
  type CssColor,
  getThemeColorScales,
  type SeverityColorNames,
  severityColors as severityDefaults,
  type ThemeInfo,
} from '@digdir/designsystemet/internal';
import { generateColorVars } from './generate-color-vars';
import type { WorkspaceTheme } from './theme-workspace';

type StepOverrides = Record<string, { light?: CssColor; dark?: CssColor }>;
type Variables = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

export type ColorTheme = {
  name: string;
  colors: ThemeInfo;
  hex?: string;
  overrides?: StepOverrides;
  variables?: Variables;
};

export type SeverityColorTheme = {
  name: SeverityColorNames;
  colors: ThemeInfo;
  hex: CssColor;
  isDefault: boolean;
  overrides?: StepOverrides;
  variables: Variables;
};

const severityNames = Object.keys(severityDefaults) as SeverityColorNames[];
const isSeverity = (name: string): name is SeverityColorNames =>
  Object.hasOwn(severityDefaults, name);

/**
 * Resolves every color of a theme to its scale in light and dark mode, with the theme's overrides applied.
 * The scales come from the CLI, so the theme builder shows the colors the CLI builds.
 * Severity colors come last and are kept apart from the theme's own colors.
 */
export function resolveThemeColors(theme: WorkspaceTheme): {
  colors: ColorTheme[];
  severityColors: SeverityColorTheme[];
} {
  const themeColors = Object.fromEntries(
    Object.entries(theme.colors).filter(([name]) => !isSeverity(name)),
  );
  const severity = Object.fromEntries(
    severityNames.map((name) => [
      name,
      theme.overrides?.severity?.[name] ||
        theme.colors[name] ||
        severityDefaults[name],
    ]),
  );
  const resolved = {
    colors: { ...themeColors, ...severity },
    overrides: { colors: theme.overrides?.colors },
  } as Parameters<typeof getThemeColorScales>[0];
  const light = getThemeColorScales(resolved, 'light');
  const dark = getThemeColorScales(resolved, 'dark');

  const toColorTheme = (name: string) => {
    const colors = { light: light[name], dark: dark[name] };
    // The neutral color uses a dedicated variable namespace
    const prefix = name === 'neutral' ? 'neutral' : undefined;
    return {
      name,
      hex: resolved.colors[name] as CssColor,
      colors,
      overrides: (theme.overrides?.colors?.[name] || {}) as StepOverrides,
      variables: {
        light: generateColorVars(colors, 'light', prefix),
        dark: generateColorVars(colors, 'dark', prefix),
      },
    };
  };

  return {
    colors: Object.keys(themeColors).map(toColorTheme),
    severityColors: severityNames.map((name) => ({
      ...toColorTheme(name),
      name,
      isDefault:
        severity[name].toLowerCase() === severityDefaults[name].toLowerCase(),
    })),
  };
}
