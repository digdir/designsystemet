import type { Config as StyleDictionaryConfig } from 'style-dictionary/types';
import type { ThemePermutation } from '../../types.js';
import { resolveMath, sizeRem, typographyName, unitless } from '../transformers.js';

export type GetStyleDictionaryConfig = (
  permutation: ThemePermutation,
) => StyleDictionaryConfig | { config: StyleDictionaryConfig; permutationOverrides?: Partial<ThemePermutation> }[];

export const fileHeader = () => [`These files are generated from design tokens defined using Token Studio`];

export const prefix = 'ds';
export const basePxFontSize = 16;

export const dsTransformers = [
  'name/kebab',
  resolveMath.name,
  'ts/size/px',
  sizeRem.name,
  unitless.name,
  'ts/typography/fontWeight',
  typographyName.name,
  'ts/color/modifiers',
  'ts/color/css/hexrgba',
  'ts/size/lineheight',
  'shadow/css/shorthand',
];
