import { compareMatch, orderByKeywords } from '../../../utilities';

import type {
  LegacyMultiSelectOption,
  LegacySingleSelectOption,
} from './types';

export const optionSearch = <
  T extends LegacySingleSelectOption | LegacyMultiSelectOption,
>(
  options: T[],
  search: string,
): T[] => {
  const keywordMap = new Map<string, string[] | undefined>(
    options.map(({ label, value, keywords }) => [
      value,
      keywords ? [label, ...keywords] : [label],
    ]),
  );
  return orderByKeywords(keywordMap, compareMatch(search)).map(
    (key) => options.find((option) => option.value === key)!,
  );
};
