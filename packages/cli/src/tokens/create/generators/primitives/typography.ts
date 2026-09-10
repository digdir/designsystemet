import type { SizeConfig, SizeModes, TokenSet, TypographySet } from '../../../types.ts';
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

export const generateTypographyMode = (mode: SizeModes, typography: TypographySet, size: SizeConfig): TokenSet => {
  const step = size.steps[mode];
  if (!step) {
    throw new Error(`Missing size step "${mode}" in theme size configuration`);
  }

  return {
    'line-height': tokensFromRecord(typography.lineHeight, 'lineHeights'),
    'font-size': tokensFromRecord(step.fontSizes, 'fontSizes'),
    'letter-spacing': tokensFromRecord(typography.letterSpacing, 'letterSpacing'),
  };
};
