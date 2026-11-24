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

  it('clamps out of range current to the first page', () => {
    for (const current of [0, -5, Number.NaN]) {
      const result = pagination({ current, total: 10, show: 5 });

      expect(result.prev).toEqual({ inert: true, value: 1 }); // Behaves as page 1
      expect(result.next).toEqual({ inert: undefined, value: 2 });
      expect(result.pages[0]['aria-current']).toBe('page');
    }
  });

  it('clamps current above total to the last page', () => {
    const result = pagination({ current: 50, total: 10, show: 5 });

    expect(result.prev).toEqual({ inert: undefined, value: 9 }); // Not page 49
    expect(result.next).toEqual({ inert: true, value: 10 });
    expect(result.pages.at(-1)?.['aria-current']).toBe('page');
  });

  it('never marks an ellipsis as the current page', () => {
    for (const current of [0, -5, 50, Number.NaN, 2.5]) {
      const { pages } = pagination({ current, total: 100, show: 7 });

      for (const page of pages)
        if (page.inert) expect(page['aria-current']).toBeUndefined();
    }
  });

  it('rounds fractional current to a whole page', () => {
    const result = pagination({ current: 2.5, total: 10, show: 5 });

    expect(result.prev).toEqual({ inert: undefined, value: 2 });
    expect(result.next).toEqual({ inert: undefined, value: 4 });
  });

  it('handles a total below one as a single page', () => {
    for (const total of [0, -5]) {
      const result = pagination({ current: 1, total, show: 5 });

      expect(result.prev).toEqual({ inert: true, value: 1 });
      expect(result.next).toEqual({ inert: true, value: 1 }); // Not page 0
      expect(result.pages).toEqual([{ 'aria-current': 'page', value: 1 }]); // Consistent with prev/next
    }
  });
});
