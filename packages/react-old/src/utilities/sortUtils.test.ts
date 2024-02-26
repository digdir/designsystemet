import { orderByKeywords } from './sortUtils';

describe('sortUtils', () => {
  describe('orderByKeywords', () => {
    // For testing purposes, use compare function that sorts strings in alphabetical order.
    const compareFn = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

    it('Returns list of keys sorted by keywords', () => {
      expect(
        orderByKeywords(
          new Map([
            ['a', ['abc', 'bcd', 'cde']],
            ['b', ['bcd', 'aaa', 'bbb']],
            ['c', ['abc', 'bbb', 'ccc']],
            ['d', ['def', 'ghi', 'jkl']],
          ]),
          compareFn,
        ),
      ).toEqual(['b', 'c', 'a', 'd']);
    });

    it('Orders by key if there are no keywords', () => {
      expect(
        orderByKeywords(
          new Map([
            ['c', []],
            ['x', ['b']],
            ['a', undefined],
          ]),
          compareFn,
        ),
      ).toEqual(['a', 'x', 'c']);
    });
  });
});
