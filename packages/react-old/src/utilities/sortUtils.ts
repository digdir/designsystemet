import type { CompareFunction } from './compareFunctions';

/**
 * Sorts a list of keys according to corresponding keywords and a given compare function..
 * If a keyword list is empty or undefined, the key itself is used instead.
 * @param {Map<string, string[] | undefined>} keywordMap A map of keys to lists of keywords.
 * @param {CompareFunction<string>} compareFn A compare function to sort the keywords.
 * @returns {string[]} A sorted list of the keys given in keywordMap.
 */
export const orderByKeywords = (
  keywordMap: Map<string, string[] | undefined>,
  compareFn: CompareFunction<string>,
): string[] =>
  [...keywordMap.entries()]
    .map(([key, keywords]) => ({
      key,
      keywords: (keywords?.length ? keywords : [key]).sort(compareFn), // Sort keywords in each list
    }))
    .sort((a, b) => {
      // Compare keyword lists.
      // If first keywords are equivalent, compare the second ones, and so on.
      const length = Math.min(a.keywords.length, b.keywords.length);
      for (let i = 0; i < length; i++) {
        const compared = compareFn(a.keywords[i], b.keywords[i]);
        if (compared !== 0) return compared;
      }
      return 0;
    })
    .map(({ key }) => key);
