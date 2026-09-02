import type { BorderWidthConfig, OpacityConfig, ShadowConfig, TokenSet } from '../../../types.ts';
import { numericKeyedValues } from '../../../utils.ts';

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
    numericKeyedValues(borderWidth, 'border-width').map(([key, value]) => [
      key,
      {
        $type: 'borderWidth',
        $value: value,
      },
    ]),
  );

// The opacity primitives are keyed by their numeric value, e.g. '30%' -> '30'.
const generateOpacities = (opacity: OpacityConfig): TokenSet =>
  Object.fromEntries(
    numericKeyedValues(opacity, 'opacity').map(([key, value]) => [
      key,
      {
        $type: 'opacity',
        $value: value,
      },
    ]),
  );

export const generateGlobals = (
  shadow: ShadowConfig,
  borderWidth: BorderWidthConfig,
  opacity: OpacityConfig,
): TokenSet => ({
  'border-width': generateBorderWidths(borderWidth),
  shadow: generateShadows(shadow),
  opacity: generateOpacities(opacity),
});
