import type { BorderWidthConfig, ShadowConfig, TokenSet } from '../../../types.ts';
import { borderWidthKey } from '../../../utils.ts';

// The shadow steps are output as a numbered scale (100, 200, ...), in the order they are defined in the config.
const generateShadows = (shadow: ShadowConfig): TokenSet =>
  Object.fromEntries(
    Object.values(shadow).map((declaration, index) => [
      String((index + 1) * 100),
      {
        $type: 'boxShadow',
        $value: declaration,
      },
    ]),
  );

// The border-width primitives are keyed by their numeric width, e.g. '3px' -> '3'.
const generateBorderWidths = (borderWidth: BorderWidthConfig): TokenSet =>
  Object.fromEntries(
    Object.values(borderWidth).map((value) => [
      borderWidthKey(value),
      {
        $type: 'borderWidth',
        $value: value,
      },
    ]),
  );

export const generateGlobals = (shadow: ShadowConfig, borderWidth: BorderWidthConfig): TokenSet => ({
  'border-width': generateBorderWidths(borderWidth),
  shadow: generateShadows(shadow),
  opacity: {
    '30': {
      $type: 'opacity',
      $value: '30%',
    },
  },
});
