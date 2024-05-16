import {
  containsAllCharsInOrder,
  indicesOf,
  numberOfMatchingChars,
} from './stringUtils';

describe('stringUtils', () => {
  describe('indicesOf', () => {
    it('Returns indices of given char in given string', () => {
      expect(indicesOf('a', 'abc')).toEqual([0]);
      expect(indicesOf('b', 'abc')).toEqual([1]);
      expect(indicesOf('a', 'abca')).toEqual([0, 3]);
    });

    it('Returns empty array if character does not exist in given string', () => {
      expect(indicesOf('d', 'abc')).toEqual([]);
      expect(indicesOf('e', '')).toEqual([]);
    });
  });

  describe('numberOfMatchingChars', () => {
    it('Returns 0 if strings are empty', () => {
      expect(numberOfMatchingChars('', '')).toBe(0);
    });

    it('Returns 0 if one of the strings is empty', () => {
      expect(numberOfMatchingChars('', 'abc')).toBe(0);
      expect(numberOfMatchingChars('cde', '')).toBe(0);
    });

    it('Returns length of string when strings are equal', () => {
      const testStr1 = 'abc';
      const testStr2 = 'Lorem ipsum';
      expect(numberOfMatchingChars(testStr1, testStr1)).toBe(testStr1.length);
      expect(numberOfMatchingChars(testStr2, testStr2)).toBe(testStr2.length);
    });

    it('Returns length of string when all characters match', () => {
      expect(numberOfMatchingChars('abc', 'cba')).toBe(3);
      expect(numberOfMatchingChars('Lorem ipsum', 'ipsum Lorem')).toBe(11);
      expect(numberOfMatchingChars('Lorem ipsum', 'muspi meroL')).toBe(11);
    });

    it('Returns number of matching characters when strings are equal in size', () => {
      expect(numberOfMatchingChars('abc', 'cde')).toBe(1);
      expect(numberOfMatchingChars('abcdef', 'ihgfed')).toBe(3);
      expect(numberOfMatchingChars('abca', 'abcd')).toBe(3);
      expect(numberOfMatchingChars('abcba', 'abcda')).toBe(4);
    });

    it('Returns number of matching characters when first string is shortest', () => {
      expect(numberOfMatchingChars('abc', 'cdef')).toBe(1);
      expect(numberOfMatchingChars('abcdef', 'ihgfedcba')).toBe(6);
      expect(numberOfMatchingChars('abca', 'abcdef')).toBe(3);
      expect(numberOfMatchingChars('abcba', 'abcdaa')).toBe(4);
    });

    it('Returns number of matching characters when second string is shortest', () => {
      expect(numberOfMatchingChars('cdef', 'abc')).toBe(1);
      expect(numberOfMatchingChars('ihgfedcba', 'abcdef')).toBe(6);
      expect(numberOfMatchingChars('abcdef', 'abca')).toBe(3);
      expect(numberOfMatchingChars('abcdaa', 'abcba')).toBe(4);
    });

    it('Is not case sensitive', () => {
      expect(numberOfMatchingChars('abc', 'ABC')).toBe(3);
      expect(numberOfMatchingChars('aBc', 'AbC')).toBe(3);
      expect(numberOfMatchingChars('ABC', 'abc')).toBe(3);
      expect(numberOfMatchingChars('AbC', 'aBc')).toBe(3);
      expect(numberOfMatchingChars('aBc', 'ABC')).toBe(3);
      expect(numberOfMatchingChars('AbC', 'abc')).toBe(3);
    });
  });

  describe('containsAllCharsInOrder', () => {
    it('Returns true if the parameters are equal', () => {
      expect(containsAllCharsInOrder('abc', 'abc')).toBe(true);
      expect(containsAllCharsInOrder('Lorem ipsum', 'Lorem ipsum')).toBe(true);
    });

    it('Returns true if all characters in the first parameter are found in the second parameter in the same order', () => {
      expect(containsAllCharsInOrder('ac', 'abc')).toBe(true);
      expect(
        containsAllCharsInOrder('ipsum sit', 'Lorem ipsum dolor sit amet'),
      ).toBe(true);
      expect(
        containsAllCharsInOrder('Lipsum', 'Lorem ipsum dolor sit amet'),
      ).toBe(true);
    });

    it('Returns false if there is no match', () => {
      expect(containsAllCharsInOrder('abc', 'def')).toBe(false);
      expect(containsAllCharsInOrder('The', 'quick brown fox')).toBe(false);
    });

    it('Returns false if some characters do not match', () => {
      expect(containsAllCharsInOrder('abc', 'cde')).toBe(false);
      expect(containsAllCharsInOrder('Lorem ipsum', 'Lipsum')).toBe(false);
    });

    it('Returns false if all characters match, but not in the given order', () => {
      expect(containsAllCharsInOrder('abc', 'cba')).toBe(false);
      expect(containsAllCharsInOrder('Lorem ipsum', 'ipsum Lorem')).toBe(false);
    });

    it('Is not case sensitive', () => {
      expect(containsAllCharsInOrder('abc', 'ABC')).toBe(true);
      expect(containsAllCharsInOrder('aBc', 'AbC')).toBe(true);
      expect(containsAllCharsInOrder('ABC', 'abc')).toBe(true);
      expect(containsAllCharsInOrder('AbC', 'aBc')).toBe(true);
      expect(containsAllCharsInOrder('aBc', 'ABC')).toBe(true);
      expect(containsAllCharsInOrder('AbC', 'abc')).toBe(true);
    });
  });
});
