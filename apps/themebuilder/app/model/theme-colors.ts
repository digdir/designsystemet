import {
  type ColorScheme,
  type CssColor,
  getThemeColorSchemes,
  type ThemeInfo,
} from '@digdir/designsystemet/internal';
import { REQUIRED_COLOR, type WorkspaceTheme } from './theme-workspace';

/** A color of a theme: its name, its base color and its resolved scale in light and dark mode */
export type ThemeColor = {
  name: string;
  hex: CssColor;
  colors: ThemeInfo;
};

/**
 * Resolves every color of a theme, with the theme's step overrides applied.
 * The scales come from the CLI, so the theme builder shows the colors the CLI builds.
 */
export const resolveThemeColors = (theme: WorkspaceTheme): ThemeColor[] =>
  Object.entries(getThemeColorSchemes(theme)).map(([name, colors]) => ({
    name,
    hex: theme.colors[name] as CssColor,
    colors,
  }));

/**
 * CSS variables for every step of a colour in a colour scheme. Without `prefix` they are the variables of
 * the active colour (`--ds-color-*`), with it those of a named colour (`--ds-color-<prefix>-*`).
 */
export const generateColorVars = (
  colors: ThemeInfo,
  colorScheme: ColorScheme,
  prefix?: string,
) =>
  Object.fromEntries(
    Object.values(colors[colorScheme]).map((color) => [
      `--ds-color-${prefix ? `${prefix}-` : ''}${color.name}`,
      color.hex,
    ]),
  );

/** CSS variables that make `color` the color of the elements they are set on, together with the theme's neutral color */
export const previewColorVars = (
  colors: ThemeColor[],
  color: ThemeColor | undefined,
  colorScheme: ColorScheme,
) => {
  // Components use the required color through its own variables, `--ds-color-neutral-*`
  const required = colors.find(({ name }) => name === REQUIRED_COLOR);
  return {
    ...(required &&
      generateColorVars(required.colors, colorScheme, REQUIRED_COLOR)),
    ...(color && generateColorVars(color.colors, colorScheme)),
  };
};
