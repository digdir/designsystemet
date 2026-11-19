import * as R from 'ramda';
import type { SizeConfig, SizeModes, TokenSet, Typography, TypographySet } from '../../../types.ts';
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

/**
 * Scales the font-size scale to a size step, the same way the CSS does:
 * `round(font-size * baseFontSize / base)`, see `--_ds-font-size-factor` in the type-scale format.
 * This keeps the font sizes in Figma (which reads these tokens) equal to the font sizes in code.
 */
export const scaleFontSizes = (fontSize: Record<string, string>, step: { baseFontSize: number; base: number }) =>
  R.map((value) => String(Math.round((Number(value) * step.baseFontSize) / step.base)), fontSize);

export const generateTypographyMode = (mode: SizeModes, typography: Typography, size: SizeConfig): TokenSet => {
  const typographySize = typography.size[mode];
  if (!typographySize) {
    throw new Error(`Missing typography for size step "${mode}" in theme typography configuration`);
  }
  const step = size.steps[mode];
  if (!step) {
    throw new Error(`Missing size step "${mode}" in theme size configuration`);
  }

  return {
    'line-height': tokensFromRecord(typographySize.lineHeight, 'lineHeights'),
    'font-size': tokensFromRecord(scaleFontSizes(typography.fontSize, step), 'fontSizes'),
    'letter-spacing': tokensFromRecord(typographySize.letterSpacing, 'letterSpacing'),
  };
};
