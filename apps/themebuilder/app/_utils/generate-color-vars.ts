import type { ColorScheme, ThemeInfo } from '@digdir/designsystemet/internal';

export const generateColorVars = (
  colors: ThemeInfo,
  colorScheme: ColorScheme,
  prefix?: string,
) => {
  const style = {} as Record<string, string>;

  for (const color of Object.values(colors[colorScheme])) {
    style[`--ds-color-${prefix ? `${prefix}-` : ''}${color.name}`] = color.hex;
  }

  return style;
};
