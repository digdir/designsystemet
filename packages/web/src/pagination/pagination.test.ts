/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';
import { pagination } from './pagination';

const waitForAttr = async (
  el: Element,
  selector: string,
  name: string,
  value: string,
) => {
  await vi.waitUntil(
    () => el.querySelector(selector)?.getAttribute(name) === value,
  );
};

describe('pagination component', () => {
  it('syncs button values and link hrefs', async () => {
    document.body.innerHTML = `
      <ds-pagination data-current="2" data-total="5" data-href="/page/%d" aria-label="Pagination">
        <button class="prev">Prev</button>
        <a>1</a>
        <a>2</a>
        <a>3</a>
        <a>4</a>
        <a>5</a>
        <button class="next">Next</button>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination') as HTMLElement;
    const prev = paginationEl.querySelector('button.prev') as HTMLButtonElement;
    const next = paginationEl.querySelector('button.next') as HTMLButtonElement;
    const links = [
      ...paginationEl.querySelectorAll('a'),
    ] as HTMLAnchorElement[];

    await waitForAttr(paginationEl, 'button.prev', 'aria-label', '1');

    expect(paginationEl).toHaveAttribute('role', 'navigation');
    expect(prev).toHaveAttribute('value', '1');
    expect(prev).toHaveAttribute('aria-label', '1');
    expect(next).toHaveAttribute('value', '3');
    expect(next).toHaveAttribute('aria-label', '3');
    expect(links[1]).toHaveAttribute('aria-current', 'true');
    expect(links[0]).toHaveAttribute('href', '/page/1');
    expect(links[1]).toHaveAttribute('href', '/page/2');
    expect(links[2]).toHaveAttribute('href', '/page/3');
  });

  it('marks hidden steps as not focusable', async () => {
    document.body.innerHTML = `
      <ds-pagination data-current="1" data-total="10" data-href="/page/%d" aria-label="Pagination">
        <button>Prev</button>
        <a>1</a>
        <a>2</a>
        <a>3</a>
        <a>4</a>
        <a>5</a>
        <button>Next</button>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination') as HTMLElement;
    const links = [
      ...paginationEl.querySelectorAll('a'),
    ] as HTMLAnchorElement[];
    const hidden = links[3];

    await waitForAttr(paginationEl, 'a:nth-of-type(4)', 'tabindex', '-1');

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
