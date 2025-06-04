import type { Format } from 'style-dictionary/types';

import { colorCategory, colorScheme } from '../formats/css/color.js';
import { semantic } from '../formats/css/semantic.js';
import { typography } from '../formats/css/typography.js';
import { typographySize } from './css/typography-size.js';

export const formats = {
  colorScheme,
  colorCategory,
  semantic,
  typography,
  typographySize,
} satisfies Record<string, Format>;
