import { containsAllCharsInOrder } from '../../../utilities';
import type { ComboboxFilter } from '../types/ComboboxFilter';

export const defaultFilter: ComboboxFilter = (inputValue, options) =>
  options.filter((option) => containsAllCharsInOrder(inputValue, option));
