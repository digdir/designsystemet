import type { SizeConfig, SizeModes, TokenSet, Typography } from '../../../types.ts';

export const generateTypography = (themeName: string, typography: Typography): TokenSet => ({
  [themeName]: {
    'font-family': {
      $type: 'fontFamilies',
      $value: typography.fontFamily,
    },
    'font-weight': Object.fromEntries(
      Object.entries(typography.fontWeight).map(([name, value]) => [
        name,
        {
          $type: 'fontWeights',
          $value: value,
        },
      ]),
    ),
  },
});

export const generateFontSizes = (mode: SizeModes, typography: Typography, size: SizeConfig): TokenSet => {
  const step = size.steps[mode];
  if (!step) {
    throw new Error(`Missing size step "${mode}" in theme size configuration`);
  }

  return {
    'line-height': Object.fromEntries(
      Object.entries(typography.lineHeight).map(([name, value]) => [
        name,
        {
          $type: 'lineHeights',
          $value: value,
        },
      ]),
    ),
    'font-size': Object.fromEntries(
      Object.entries(step.fontSizes).map(([name, value]) => [
        name,
        {
          $type: 'fontSizes',
          $value: value,
        },
      ]),
    ),
    'letter-spacing': Object.fromEntries(
      Object.entries(typography.letterSpacing).map(([name, value]) => [
        name,
        {
          $type: 'letterSpacing',
          $value: value,
        },
      ]),
    ),
  };
};
