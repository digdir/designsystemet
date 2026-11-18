/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';
import { pagination } from './pagination';

describe('pagination helper', () => {
  it('generates steps with ellipsis markers', () => {
    const result = pagination({ current: 1, total: 10, show: 5 });

    expect(result.prev.value).toBe(0);
    expect(result.next.value).toBe(2);
    expect(result.pages.map(({ value }) => value)).toEqual([1, 2, 3, 0, 10]);
    expect(result.pages[0]['aria-current']).toBe('page');
    expect(result.pages[1]['aria-current']).toBeUndefined();
  });
});
