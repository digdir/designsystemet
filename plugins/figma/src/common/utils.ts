import type { ThemeInfo } from '@digdir/designsystemet/color';

import type { ThemeInfo as FigmaThemeInfo } from './store';

export const themeToFigmaFormat = (theme: ThemeInfo): FigmaThemeInfo => {
  const createColorInfo = (colors: typeof theme.light) => ({
    1: colors[0].hex,
    2: colors[1].hex,
    3: colors[2].hex,
    4: colors[3].hex,
    5: colors[4].hex,
    6: colors[5].hex,
    7: colors[6].hex,
    8: colors[7].hex,
    9: colors[8].hex,
    10: colors[9].hex,
    11: colors[10].hex,
    12: colors[11].hex,
    13: colors[12].hex,
    14: colors[13].hex,
    15: colors[14].hex,
    16: colors[15].hex,
  });

  return {
    light: createColorInfo(theme.light),
    dark: createColorInfo(theme.dark),
    contrast: createColorInfo(theme.dark), // Contrast uses dark colors
  };
};
