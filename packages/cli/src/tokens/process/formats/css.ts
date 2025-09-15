import type { Format } from 'style-dictionary/types';

import { colorCategory, colorScheme } from '../formats/css/color.js';
import { semantic } from '../formats/css/semantic.js';
import { size } from '../formats/css/size.js';
import { sizeMode } from '../formats/css/size-mode.js';
import { typography } from '../formats/css/typography.js';
import { typeScale } from './css/type-scale.js';

export const formats = {
  colorScheme,
  colorCategory,
  semantic,
  sizeMode,
  size,
  typography,
  typeScale,
} satisfies Record<string, Format>;
