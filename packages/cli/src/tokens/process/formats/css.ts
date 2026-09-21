import type { Format } from 'style-dictionary/types';

import { colorCategory, colorScheme } from '../formats/css/color.ts';
import { semantic } from '../formats/css/semantic.ts';
import { size } from '../formats/css/size.ts';
import { sizeMode } from '../formats/css/size-mode.ts';
import { typography } from '../formats/css/typography.ts';
import { typeScale } from './css/type-scale.ts';

export const formats = {
  colorScheme,
  colorCategory,
  semantic,
  sizeMode,
  size,
  typography,
  typeScale,
} satisfies Record<string, Format>;
