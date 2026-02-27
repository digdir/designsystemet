/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
import { pagination } from './pagination';

describe('pagination component', () => {
  it('has correct aria attributes', async () => {
    document.body.innerHTML = `
      <ds-pagination data-current="2" data-total="5" data-href="/page/%d" aria-label="Pagination">
       <ol>
          <li><a class="ds-button prev" data-variant="tertiary" href="#none">prev</a></li>
          <li><a class="ds-button" data-variant="tertiary" href="/page/1"></a></li>
          <li><a class="ds-button" data-variant="tertiary" href="/page/2"></a></li>
          <li><a class="ds-button" data-variant="tertiary" href="/page/3"></a></li>
          <li><a class="ds-button" data-variant="tertiary" href="/page/4"></a></li>
          <li><a class="ds-button" data-variant="tertiary" href="/page/5"></a></li>
          <li><a class="ds-button next" data-variant="tertiary" href="#none">next</a></li>
       </ol>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination') as HTMLElement;
    const prev = paginationEl.querySelector('a.prev') as HTMLAnchorElement;
    const next = paginationEl.querySelector('a.next') as HTMLAnchorElement;
    const links = [
      ...paginationEl.querySelectorAll('a'),
    ] as HTMLAnchorElement[];

    await vi.waitUntil(() => prev.getAttribute('aria-label') === '1');

    expect(paginationEl).toHaveAttribute('role', 'navigation');
    expect(prev).toHaveAttribute('aria-label', '1');
    expect(next).toHaveAttribute('aria-label', '3');
    expect(links[2]).toHaveAttribute('aria-label', '2');
    expect(links[2]).toHaveAttribute('aria-current', 'true');
  });

  it('marks hidden steps as not focusable', async () => {
    document.body.innerHTML = `
      <ds-pagination data-current="1" data-total="100" data-href="/page/%d" aria-label="Pagination">
     <ol>
        <li><button class="ds-button prev" data-variant="tertiary">prev</button></li>
        <li><button class="ds-button" data-variant="tertiary">1</button></li>
        <li><button class="ds-button" data-variant="tertiary">2</button></li>
        <li><button class="ds-button" data-variant="tertiary">3</button></li>
        <li><button class="ds-button" data-variant="tertiary">4</button></li>
        <li><button class="ds-button" data-variant="tertiary">5</button></li>
        <li><button class="ds-button next" data-variant="tertiary">next</button></li>
      </ol>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination') as HTMLElement;
    const links = [
      ...paginationEl.querySelectorAll('button'),
    ] as HTMLButtonElement[];
    const hidden = links[4];

    await vi.waitUntil(() => hidden.getAttribute('tabindex') === '-1');

    expect(hidden).toHaveAttribute('role', 'none');
    expect(hidden).toHaveAttribute('tabindex', '-1');
    expect(hidden).not.toHaveAttribute('aria-current');
  });
});

describe('pagination helper', () => {
  it('generates steps with ellipsis markers', () => {
    const result = pagination({ current: 1, total: 10, show: 5 });

    expect(result.prev).toBe(0);
    expect(result.next).toBe(2);
    expect(result.pages.map((page) => page.page)).toEqual([1, 2, 3, 0, 10]);
    expect(result.pages[0].current).toBe('page');
  });
});
