import type { ThemeInfo } from '@digdir/designsystemet/color';

import type { ThemeInfo as Test } from './store';

export const themeToFigmaFormat = (theme: ThemeInfo): Test => {
  return {
    light: {
      1: theme.light[0].hex,
      2: theme.light[1].hex,
      3: theme.light[2].hex,
      4: theme.light[3].hex,
      5: theme.light[4].hex,
      6: theme.light[5].hex,
      7: theme.light[6].hex,
      8: theme.light[7].hex,
      9: theme.light[8].hex,
      10: theme.light[9].hex,
      11: theme.light[10].hex,
      12: theme.light[11].hex,
      13: theme.light[12].hex,
      'contrast-1': theme.light[13].hex,
      'contrast-2': theme.light[14].hex,
    },
    dark: {
      1: theme.dark[0].hex,
      2: theme.dark[1].hex,
      3: theme.dark[2].hex,
      4: theme.dark[3].hex,
      5: theme.dark[4].hex,
      6: theme.dark[5].hex,
      7: theme.dark[6].hex,
      8: theme.dark[7].hex,
      9: theme.dark[8].hex,
      10: theme.dark[9].hex,
      11: theme.dark[10].hex,
      12: theme.dark[11].hex,
      13: theme.dark[12].hex,
      'contrast-1': theme.dark[13].hex,
      'contrast-2': theme.dark[14].hex,
    },
    contrast: {
      1: theme.dark[0].hex,
      2: theme.dark[1].hex,
      3: theme.dark[2].hex,
      4: theme.dark[3].hex,
      5: theme.dark[4].hex,
      6: theme.dark[5].hex,
      7: theme.dark[6].hex,
      8: theme.dark[7].hex,
      9: theme.dark[8].hex,
      10: theme.dark[9].hex,
      11: theme.dark[10].hex,
      12: theme.dark[11].hex,
      13: theme.dark[12].hex,
      'contrast-1': theme.dark[13].hex,
      'contrast-2': theme.dark[14].hex,
    },
  };
};
