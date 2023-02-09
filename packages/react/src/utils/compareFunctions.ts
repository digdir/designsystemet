/**
 * Compare functions to be used in conjunction with the sort method.
 * These should take two parameters and return a positive number if the first parameter should be sorted after the second,
 * a negative number if the first parameter should be sorted before the second, or 0 if there is no preference.
 */

import {containsAllCharsInOrder, numberOfMatchingChars} from "./stringUtils";

export type CompareFunction<T> = (a: T, b: T) => number;
export type SearchCompareFunction = (search: string) => CompareFunction<string>;

export const compareMatchingCharsInOrder: SearchCompareFunction =
  (search) => (a, b) => {
    const aContains: boolean = containsAllCharsInOrder(search, a);
    const bContains: boolean = containsAllCharsInOrder(search, b);
    if (!aContains && !bContains) return 0;
    if (aContains && !bContains) return -1;
    if (!aContains && bContains) return 1;

    // Both contain the search string, so compare the index of the first match.
    // If the first match index is the same, compare the second match, etc.
    let matchIndex = 0;
    for (let i = 0; i < search.length; i++) {
      const aIndex: number = a.substring(matchIndex).indexOf(search[i]);
      const bIndex: number = b.substring(matchIndex).indexOf(search[i]);
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
export const compareMatch: SearchCompareFunction =
  (search) => (a, b) => {
    const comparedInOrder: number = compareMatchingCharsInOrder(search)(a, b);
    if (comparedInOrder !== 0) return comparedInOrder;
    return compareNumberOfMatchingChars(search)(a, b);
  }