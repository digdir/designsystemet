/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';
import { pagination } from './pagination';

describe('pagination helper', () => {
  it('should provide correct amount of pages with 10 pages when current page is 6', () => {
    const expected = [
      [6],
      [6, 7],
      [5, 6, 7],
      [5, 6, '', 10],
      [1, '', 6, '', 10],
      [1, '', 6, 7, '', 10],
      [1, '', 5, 6, 7, '', 10],
      [1, '', 5, 6, 7, 8, 9, 10],
      [1, '', 4, 5, 6, 7, 8, 9, 10],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ];

    for (const expectPages of expected) {
      const { pages } = pagination({
        total: 10,
        current: 6,
        show: expectPages.length,
      });

      expect(pages).toHaveLength(expectPages.length);

      expectPages.forEach((value, index) => {
        expect(pages[index].value).toBe(value || 0);
      });
    }
  });

  it('generates steps with ellipsis markers', () => {
    const result = pagination({ current: 1, total: 10, show: 5 });

    expect(result.prev).toEqual({ inert: true, value: 1 }); // Clamped and inert on first page
    expect(result.next).toEqual({ inert: undefined, value: 2 });
    expect(result.pages.map(({ value }) => value)).toEqual([1, 2, 3, 0, 10]);
    expect(result.pages.map(({ inert }) => inert)).toEqual([
      undefined,
      undefined,
      undefined,
      true, // Ellipsis
      undefined,
    ]);
    expect(result.pages[0]['aria-current']).toBe('page');
    expect(result.pages[1]['aria-current']).toBeUndefined();
  });

  it('marks next as inert and clamps value on the last page', () => {
    const result = pagination({ current: 10, total: 10, show: 5 });

    expect(result.prev).toEqual({ inert: undefined, value: 9 });
    expect(result.next).toEqual({ inert: true, value: 10 });
  });
});
