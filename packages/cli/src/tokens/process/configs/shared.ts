import type { Config as StyleDictionaryConfig } from 'style-dictionary/types';
import { resolveMath, sizeRem, typographyName, unitless } from '../transformers.js';
import type { ThemePermutation } from '../types.js';

export type GetStyleDictionaryConfig = (
  permutation: ThemePermutation,
  options: {
    outPath?: string;
  },
) => StyleDictionaryConfig | { config: StyleDictionaryConfig; permutationOverrides?: Partial<ThemePermutation> }[];

export const fileHeader = () => [`These files are generated from design tokens defind using Token Studio`];

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
