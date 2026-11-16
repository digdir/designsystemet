import {
  type ColorScheme,
  type CssColor,
  getThemeColorSchemes,
  type ThemeInfo,
} from '@digdir/designsystemet/internal';
import { generateColorVars } from './generate-color-vars';
import type { WorkspaceTheme } from './theme-workspace';

/** A color of a theme: its name, its base color and its resolved scale in light and dark mode */
export type ColorTheme = {
  name: string;
  hex: CssColor;
  colors: ThemeInfo;
};

/**
 * Resolves every color of a theme, with the theme's step overrides applied.
 * The scales come from the CLI, so the theme builder shows the colors the CLI builds.
 */
export const resolveThemeColors = (theme: WorkspaceTheme): ColorTheme[] =>
  Object.entries(getThemeColorSchemes(theme)).map(([name, colors]) => ({
    name,
    hex: theme.colors[name] as CssColor,
    colors,
  }));

/** CSS variables that make `color` the color of the elements they are set on, together with the theme's neutral color */
export const previewColorVars = (
  colors: ColorTheme[],
  color: ColorTheme | undefined,
  colorScheme: ColorScheme,
) => {
  const neutral = colors.find(({ name }) => name === 'neutral');
  return {
    ...(neutral && generateColorVars(neutral.colors, colorScheme, 'neutral')),
    ...(color && generateColorVars(color.colors, colorScheme)),
  };
};
