import type { ColorScheme, ThemeInfo } from '@digdir/designsystemet/color';

export const generateColorVars = (
  colors: ThemeInfo,
  colorScheme: ColorScheme,
) => {
  const style = {} as Record<string, string>;

  let loopColors = colors.light;

  if (colorScheme === 'dark') {
    loopColors = colors.dark;
  }

  if (colorScheme === 'contrast') {
    loopColors = colors.contrast;
  }

  for (const color of loopColors) {
    style[`--ds-color-${color.name}`] = color.hex;
  }

  return style;
};

export const generateNeutralColorVars = (
  colors: ThemeInfo,
  colorScheme: ColorScheme,
) => {
  const style = {} as Record<string, string>;

  let loopColors = colors.light;

  if (colorScheme === 'dark') {
    loopColors = colors.dark;
  }

  if (colorScheme === 'contrast') {
    loopColors = colors.contrast;
  }

  for (const color of loopColors) {
    style[`--ds-color-neutral-${color.name}`] = color.hex;
  }

  return style;
};
