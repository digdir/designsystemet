import type { TransformedToken } from 'style-dictionary/types';
import { describe, expect, it } from 'vitest';
import type { Theme } from './types.ts';
import {
  getValue,
  inlineTokens,
  isDigit,
  orderBySize,
  pathStartsWithOneOf,
  shortSizeName,
  toColorNames,
  typeEquals,
} from './utils.ts';

const token = (partial: Partial<TransformedToken>): TransformedToken => partial as TransformedToken;

describe('getValue', () => {
  it('prefers $value over value', () => {
    expect(getValue(token({ $value: 'a', value: 'b' }))).toBe('a');
  });

  it('falls back to value', () => {
    expect(getValue(token({ value: 'b' }))).toBe('b');
  });
});

describe('typeEquals', () => {
  it('matches a single type case-insensitively', () => {
    expect(typeEquals('color', token({ $type: 'Color' }))).toBe(true);
    expect(typeEquals('color', token({ $type: 'dimension' }))).toBe(false);
  });

  it('matches any type in an array', () => {
    expect(typeEquals(['color', 'dimension'], token({ type: 'dimension' }))).toBe(true);
  });
});

describe('pathStartsWithOneOf', () => {
  it('matches string and array path prefixes case-insensitively', () => {
    const t = token({ path: ['Color', 'accent', '1'] });
    expect(pathStartsWithOneOf(['color'], t)).toBe(true);
    expect(pathStartsWithOneOf([['color', 'accent']], t)).toBe(true);
    expect(pathStartsWithOneOf([['color', 'neutral']], t)).toBe(false);
  });

  it('is curried', () => {
    expect(pathStartsWithOneOf(['size'])(token({ path: ['size', '1'] }))).toBe(true);
  });
});

describe('isDigit', () => {
  it('accepts only strings of digits', () => {
    expect(isDigit('12')).toBe(true);
    expect(isDigit('1a')).toBe(false);
    expect(isDigit('')).toBe(false);
  });
});

describe('inlineTokens', () => {
  it('removes matching tokens and inlines their value into references', () => {
    const tokens = [
      token({ path: ['size', 'base'], original: { $value: '8px' } }),
      token({ path: ['size', '1'], original: { $value: '{size.base} * 2' } }),
      token({ path: ['size', 'sm'], original: { $value: 'min({size.1}, 12px)' } }),
    ];

    const result = inlineTokens((t) => t.path.join('.') === 'size.1', tokens);

    expect(result.map((t) => t.path.join('.'))).toEqual(['size.base', 'size.sm']);
    expect(getValue<string>(result[1].original)).toBe('min({size.base} * 2, 12px)');
  });
});

describe('shortSizeName', () => {
  it('shortens known size names and passes unknown ones through', () => {
    expect(shortSizeName('small')).toBe('sm');
    expect(shortSizeName('xlarge')).toBe('xl');
    expect(shortSizeName('custom')).toBe('custom');
  });
});

describe('orderBySize', () => {
  it('orders long and short size names from smallest to largest', () => {
    expect(orderBySize(['large', 'small', 'medium'])).toEqual(['small', 'medium', 'large']);
    expect(orderBySize(['xl', 'sm', 'md'])).toEqual(['sm', 'md', 'xl']);
  });
});

describe('toColorNames', () => {
  it('returns user colors followed by all severity colors', () => {
    const colors = { accent: '#0062BA', warning: '#EA9B1B' } as Theme['colors'];
    expect(toColorNames(colors)).toEqual(['accent', 'info', 'success', 'warning', 'danger']);
  });
});
