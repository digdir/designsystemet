import {
  compareMatchingCharsInOrder,
  containsAllCharsInOrder,
} from '../../../utils';
import type { ComboboxFilter } from '../types/ComboboxFilter';

export const defaultFilter: ComboboxFilter = (inputValue, options) =>
  options
    .filter(
      (option) =>
        containsAllCharsInOrder(inputValue, option.value) ||
        (typeof option.label === 'string' &&
          containsAllCharsInOrder(inputValue, option.label)),
    )
    .sort((a, b) => {
      const stringToCompareA = typeof a.label === 'string' ? a.label : a.value;
      const stringToCompareB = typeof b.label === 'string' ? b.label : b.value;
      return compareMatchingCharsInOrder(inputValue)(
        stringToCompareA,
        stringToCompareB,
      );
    });
