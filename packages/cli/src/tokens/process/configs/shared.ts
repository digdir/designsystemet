import type { Config as StyleDictionaryConfig, TransformedToken } from 'style-dictionary/types';
import type { ThemePermutation } from '../../types.ts';
import { dsName, resolveMath, sizeRem, unitless } from '../transformers.ts';

export type GetStyleDictionaryConfig = (
  permutation: ThemePermutation,
) => StyleDictionaryConfig | { config: StyleDictionaryConfig; permutationOverrides?: Partial<ThemePermutation> }[];

export const prefix = 'ds';
export const basePxFontSize = 16;

export const dsTransformers = [
  dsName.name,
  resolveMath.name,
  'ts/size/px',
  sizeRem.name,
  unitless.name,
  'ts/typography/fontWeight',
  'ts/color/modifiers',
  'ts/color/css/hexrgba',
  'ts/size/lineheight',
  'shadow/css/shorthand',
];

/**
 * Whether a token comes from a typography set's primitives, i.e. `primitives/modes/typography/<set>/<theme>`.
 * These hold the per-set font-family and font-weights and are only referenced by other tokens, so they are
 * never output as CSS variables themselves. The size-mode sets in `primitives/modes/typography/size/` are not included.
 */
export const isTypographySetPrimitive = (token: TransformedToken): boolean =>
  /primitives\/modes\/typography\/(?!size\/)[^/]+\//.test(token.filePath ?? '');
