import type { ColorScheme, ThemeInfo } from '@digdir/designsystemet/color';

export const generateColorVars = (
  colors: ThemeInfo,
  colorScheme: ColorScheme,
) => {
  const style = {} as Record<string, string>;

  for (const color of colors[colorScheme]) {
    style[`--ds-color-${color.name}`] = color.hex;
  }

  return style;
};

export const generateNeutralColorVars = (
  colors: ThemeInfo,
  colorScheme: ColorScheme,
) => {
  const style = {} as Record<string, string>;

  for (const color of colors[colorScheme]) {
    style[`--ds-color-neutral-${color.name}`] = color.hex;
  }

  return style;
};
