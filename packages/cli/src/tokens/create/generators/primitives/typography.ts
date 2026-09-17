import type { SizeModes, TokenSet, Typography, TypographySet } from '../../../types.ts';
import { tokensFromRecord } from '../../../utils.ts';

export const generateTypography = (themeName: string, typography: TypographySet): TokenSet => ({
  [themeName]: {
    'font-family': {
      $type: 'fontFamilies',
      $value: typography.fontFamily,
    },
    'font-weight': tokensFromRecord(typography.fontWeight, 'fontWeights'),
  },
});

export const generateTypographyMode = (mode: SizeModes, typography: Typography): TokenSet => {
  const size = typography.size[mode];
  if (!size) {
    throw new Error(`Missing typography for size step "${mode}" in theme typography configuration`);
  }

  return {
    'line-height': tokensFromRecord(size.lineHeight, 'lineHeights'),
    'font-size': tokensFromRecord(size.fontSize, 'fontSizes'),
    'letter-spacing': tokensFromRecord(size.letterSpacing, 'letterSpacing'),
  };
};
