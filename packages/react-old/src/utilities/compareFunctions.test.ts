import {
  compareMatch,
  compareMatchingCharsInOrder,
  compareNumberOfMatchingChars,
} from './compareFunctions';

describe('compareFunctions', () => {
  describe('compareMatchingCharsInOrder', () => {
    const compare = compareMatchingCharsInOrder('abc');

    it('Returns 0 if none of the strings match', () => {
      expect(compare('cde', 'fgh')).toBe(0);
      expect(compare('Lorem', 'ipsum')).toBe(0);
    });

    it('Returns -1 if A matches, but not B', () => {
      expect(compare('abcde', 'fgh')).toBe(-1);
      expect(compare('dadbdc', 'ijk')).toBe(-1);
    });

    it('Returns 1 if B matches, but not A', () => {
      expect(compare('fgh', 'abcde')).toBe(1);
      expect(compare('ijk', 'dadbdc')).toBe(1);
    });

    it('Returns 0 if both strings match at the same positions', () => {
      expect(compare('abcde', 'abcfg')).toBe(0);
      expect(compare('Lorem abc', 'ipsum abc')).toBe(0);
    });

    it('Returns -1 if first char in A matches before first char in B', () => {
      expect(compare('abcde', 'eabcd')).toBe(-1);
      expect(compare('dd a dd bc', 'ddd a dd bc')).toBe(-1);
    });

    it('Returns 1 if first char in B matches before first char in A', () => {
      expect(compare('eabcd', 'abcde')).toBe(1);
      expect(compare('ddd a dd bc', 'dd a dd bc')).toBe(1);
    });

    it('Returns -1 if first matching chars are in the same position, but second char in A matches before second char in B', () => {
      expect(compare('abcde', 'aebcd')).toBe(-1);
      expect(compare('dd a dd bc', 'dd a ddd bc')).toBe(-1);
    });

    it('Returns 1 if first matching chars are in the same position, but second char in A matches before second char in B', () => {
      expect(compare('aebcd', 'abcde')).toBe(1);
      expect(compare('dd a ddd bc', 'dd a dd bc')).toBe(1);
    });

    it('Takes order into account', () => {
      expect(compare('bcd abc', 'dbc abc')).toBe(0); // Should not take the part before "a" into account
    });

    it('Is not case sensitive', () => {
      expect(compare('abc', 'ABC')).toBe(0);
      expect(compare('aBc', 'adc')).toBe(-1);
    });
  });

  describe('compareNumberOfMatchingChars', () => {
    const compare = compareNumberOfMatchingChars('abc');

    it('Returns 0 if none of the strings match', () => {
      expect(compare('def', 'ghi')).toBe(0);
      expect(compare('Lorem', 'ipsum')).toBe(0);
    });

    it('Returns a negative number if A matches more chars than B', () => {
      expect(compare('abcde', 'fgh')).toBeLessThan(0);
      expect(compare('cb', 'ade')).toBeLessThan(0);
    });

    it('Returns a positive number if B matches more chars than A', () => {
      expect(compare('fgh', 'abcde')).toBeGreaterThan(0);
      expect(compare('ade', 'cb')).toBeGreaterThan(0);
    });

    it('Returns 0 if A and B match the same number of chars', () => {
      expect(compare('abcde', 'edcba')).toBe(0);
      expect(compare('Lorem abc', 'ipsum cab')).toBe(0);
    });
  });

  describe('compareMatch', () => {
    it.each([
      ['abc', 'cba', 'abc'],
      ['abc', 'cabc', 'abc'],
      ['abd', 'a', 'abc'],
      ['What does the fox say?', 'The quick brown fox', 'fox'],
      ['The quick brown fox', 'What does the fox say?', 'the fox'],
    ])('Sorts "%s" before "%s" when search string is "%s"', (a, b, search) => {
      const compare = compareMatch(search);
      expect(compare(a, b)).toBeLessThan(0);
      expect(compare(b, a)).toBeGreaterThan(0);
    });

    it.each([
      ['abc', 'abc', 'abc'],
      ['abcd', 'abce', 'abc'],
      ['-a-b-c-', '.a.b.c.', 'abc'],
    ])(
      'Treats "%s" and "%s" as equivalent when search string is "%s"',
      (a, b, search) => {
        const compare = compareMatch(search);
        expect(compare(a, b)).toBe(0);
      },
    );
  });
});
