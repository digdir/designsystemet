import { areItemsUnique, arraysEqual, lastItem } from './arrayUtils';

describe('arrayUtils', () => {
  describe('arraysEqual', () => {
    it('Returns true if arrays are the same', () => {
      const array = [1, 2, 3];
      expect(arraysEqual(array, array)).toBe(true);
    });

    it('Returns true if arrays have equal content', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(arraysEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
      expect(arraysEqual([true, false], [true, false])).toBe(true);
      expect(arraysEqual([1, 'b', true], [1, 'b', true])).toBe(true);
    });

    it('Returns true if both arrays are undefined', () => {
      expect(arraysEqual(undefined, undefined)).toBe(true);
    });

    it('Returns false if one of the arrays is undefined', () => {
      expect(arraysEqual([1, 2, 3], undefined)).toBe(false);
      expect(arraysEqual(undefined, [1, 2, 3])).toBe(false);
    });

    it('Returns false if the arrays have different length', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
      expect(arraysEqual([1, 2, 3, 4], [1, 2, 3])).toBe(false);
    });

    it('Returns false if the arrays have different order', () => {
      expect(arraysEqual([1, 2, 3], [1, 3, 2])).toBe(false);
      expect(arraysEqual([3, 2, 1], [2, 3, 1])).toBe(false);
      expect(arraysEqual(['a', 'b', 'c'], ['c', 'a', 'b'])).toBe(false);
      expect(arraysEqual([true, false], [false, true])).toBe(false);
    });

    it('Returns false if the arrays have different content', () => {
      expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(arraysEqual<string | number>([1, 2, 3], ['a', 'b', 'c'])).toBe(
        false,
      );
      expect(arraysEqual<string | number>([1, 2, 3], ['1', '2', '3'])).toBe(
        false,
      );
      expect(arraysEqual(['a', 'b', 'c'], ['å', 'b', 'c'])).toBe(false);
      expect(arraysEqual([true, false], [true, true])).toBe(false);
      expect(arraysEqual([1, 'b', true], [0, 'b', true])).toBe(false);
    });
  });

  describe('lastItem', () => {
    it('Returns last element of given array', () => {
      expect(lastItem([1, 2, 3])).toBe(3);
      expect(lastItem([true, false])).toBe(false);
      expect(lastItem(['test'])).toBe('test');
    });

    it('Returns undefined if given array is empty', () => {
      expect(lastItem([])).toBeUndefined();
    });
  });

  describe('areItemsUnique', () => {
    it('Returns true if all items are unique', () => {
      expect(areItemsUnique([1, 2, 3])).toBe(true);
      expect(areItemsUnique(['a', 'b', 'c'])).toBe(true);
      expect(areItemsUnique(['abc', 'bcd', 'cde'])).toBe(true);
      expect(areItemsUnique([true, false])).toBe(true);
      expect(areItemsUnique([1, 'b', true])).toBe(true);
      expect(areItemsUnique([0, '', false, null, undefined])).toBe(true);
    });

    it('Returns true if array is empty', () => {
      expect(areItemsUnique([])).toBe(true);
    });

    it('Returns false if there is at least one duplicated item', () => {
      expect(areItemsUnique([1, 2, 1])).toBe(false);
      expect(areItemsUnique(['a', 'a', 'c'])).toBe(false);
      expect(areItemsUnique(['abc', 'bcd', 'bcd'])).toBe(false);
      expect(areItemsUnique([true, false, true])).toBe(false);
      expect(areItemsUnique([1, 'b', false, 1])).toBe(false);
      expect(areItemsUnique([null, null])).toBe(false);
      expect(areItemsUnique([undefined, undefined])).toBe(false);
    });
  });
});
