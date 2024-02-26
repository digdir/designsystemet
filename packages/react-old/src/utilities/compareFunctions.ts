/**
 * Compare functions to be used in conjunction with the sort method.
 * These should take two parameters and return a positive number if the first parameter should be sorted after the second,
 * a negative number if the first parameter should be sorted before the second, or 0 if there is no preference.
 */

import { containsAllCharsInOrder, numberOfMatchingChars } from './stringUtils';

export type CompareFunction<T> = (a: T, b: T) => number;
export type SearchCompareFunction = (search: string) => CompareFunction<string>;

/**
 * Returns a compare function that sorts strings by the index of the search string characters, given that all characters appear in the values in the same order.
 * It is not case sensitive.
 * - If only one of the compared values contains all characters in the same order, that value is ranked first.
 * - If both values contain all characters in the same order, the index of the first character is compared first, then the second one, etc.
 * I.e. if the search string is "bar", then "Barbados" will be sorted before "Bahrain" because the letter "r" appears earlier in "Barbados".
 * @param search The search string of which the characters should be present.
 * @returns A compare function that can be used as a parameter to Array.sort().
 */
export const compareMatchingCharsInOrder: SearchCompareFunction =
  (search) => (a, b) => {
    const searchLow = search.toLowerCase();
    const aLow = a.toLowerCase();
    const bLow = b.toLowerCase();

    const aContains: boolean = containsAllCharsInOrder(searchLow, aLow);
    const bContains: boolean = containsAllCharsInOrder(searchLow, bLow);
    if (!aContains && !bContains) return 0;
    if (aContains && !bContains) return -1;
    if (!aContains && bContains) return 1;

    // Both contain the search string, so compare the index of the first match.
    // If the first match index is the same, compare the second match, etc.
    let matchIndex = 0;
    for (let i = 0; i < search.length; i++) {
      const aIndex: number = aLow.substring(matchIndex).indexOf(searchLow[i]);
      const bIndex: number = bLow.substring(matchIndex).indexOf(searchLow[i]);
      if (aIndex < bIndex) return -1;
      if (aIndex > bIndex) return 1;
      // aIndex and bIndex are the same, so update matchIndex and continue.
      matchIndex += aIndex + 1;
    }

    // All characters match at the same place.
    return 0;
  };

export const compareNumberOfMatchingChars: SearchCompareFunction =
  (search) => (a, b) => {
    const aMatches: number = numberOfMatchingChars(search, a);
    const bMatches: number = numberOfMatchingChars(search, b);
    return bMatches - aMatches;
  };

/**
 * Returns a sort function with the following strategy:
 * 1. Sort strings that contain all chars in the search string in the same order first.
 *    If the characters match at different indices, sort by the index of the first match.
 *    If those are the same, sort by the index of the second match, and so on.
 * 2. Sort by the number of matching characters.
 */
export const compareMatch: SearchCompareFunction = (search) => (a, b) => {
  const comparedInOrder: number = compareMatchingCharsInOrder(search)(a, b);
  if (comparedInOrder !== 0) return comparedInOrder;
  return compareNumberOfMatchingChars(search)(a, b);
};
