import {
  compareMatchingCharsInOrder,
  containsAllCharsInOrder,
} from '../../../../utilities';
import type { ComboboxFilter } from '../types/ComboboxFilter';

import { getCountryName } from './getCountryName';

export const customFilter: ComboboxFilter = (inputValue, countryCodes) =>
  countryCodes
    .filter((code) => containsAllCharsInOrder(inputValue, getCountryName(code)))
    .sort(compareCodeByMatchInName(inputValue));

const compareCodeByMatchInName =
  (inputValue: string) => (a: string, b: string) =>
    compareMatchingCharsInOrder(inputValue)(
      getCountryName(a),
      getCountryName(b),
    );
