/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it } from 'vitest';
import { pagination } from './pagination';

const tick = async (_?: unknown) =>
  await new Promise((resolve) => setTimeout(resolve)); // Let MutationObserver run Loop

describe('pagination component', () => {
  it('has correct aria attributes', async () => {
    document.body.innerHTML = `
      <ds-pagination data-current="2" data-total="5" data-href="/page/%d" aria-label="Pagination">
       <ol>
          <li><a class="ds-button" data-testid="prev" href="#none">prev</a></li>
          <li><a class="ds-button" href="/page/1"></a></li>
          <li><a class="ds-button" href="/page/2"></a></li>
          <li><a class="ds-button" href="/page/3"></a></li>
          <li><a class="ds-button" href="/page/4"></a></li>
          <li><a class="ds-button" href="/page/5"></a></li>
          <li><a class="ds-button" data-testid="next" href="#none">next</a></li>
       </ol>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination');
    const prev = paginationEl?.querySelector('[data-testid="prev"]');
    const next = paginationEl?.querySelector('[data-testid="next"]');
    const links = paginationEl?.querySelectorAll('a');

    await tick(); // Let mutation observer run
    expect(paginationEl).toHaveAttribute('role', 'navigation');
    expect(prev).not.toHaveAttribute('aria-label'); // Text content is the accessible name
    expect(prev).toHaveAttribute('href', '/page/1');
    expect(next).not.toHaveAttribute('aria-label');
    expect(next).toHaveAttribute('href', '/page/3');
    expect(links?.[2]).toHaveAttribute('aria-label', '2');
    expect(links?.[2]).toHaveAttribute('aria-current', 'true');
  });

  it('respects aria-labelledby and does not set aria-label', async () => {
    document.body.innerHTML = `
      <span id="pg-label">External label</span>
      <ds-pagination data-current="2" data-total="5" data-href="/page/%d" aria-labelledby="pg-label">
        <ol>
          <li><a class="ds-button" href="#none">prev</a></li>
          <li><a class="ds-button" href="/page/1"></a></li>
          <li><a class="ds-button" href="/page/2"></a></li>
          <li><a class="ds-button" href="#none">next</a></li>
        </ol>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination') as HTMLElement;
    expect(paginationEl).toHaveAttribute('aria-labelledby', 'pg-label');
    expect(paginationEl).not.toHaveAttribute('aria-label');
  });

  it('keeps aria-label on text-less previous/next buttons', async () => {
    document.body.innerHTML = `
      <ds-pagination data-current="3" data-total="5" aria-label="Pagination">
        <ol>
          <li><button class="ds-button" data-testid="prev" aria-label="Forrige side"></button></li>
          <li><button class="ds-button"></button></li>
          <li><button class="ds-button"></button></li>
          <li><button class="ds-button"></button></li>
          <li><button class="ds-button" data-testid="next" aria-label="Neste side"></button></li>
        </ol>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination');
    const prev = paginationEl?.querySelector('[data-testid="prev"]');
    const next = paginationEl?.querySelector('[data-testid="next"]');

    await tick(); // Let mutation observer run
    expect(prev).toHaveAttribute('aria-label', 'Forrige side');
    expect(prev).toHaveAttribute('value', '2');
    expect(next).toHaveAttribute('aria-label', 'Neste side');
    expect(next).toHaveAttribute('value', '4');
  });

  it('falls back to CSS label on text-less previous/next buttons', async () => {
    document.body.innerHTML = `
      <ds-pagination data-current="2" data-total="5" aria-label="Pagination">
        <ol>
          <li><button class="ds-button" data-testid="prev" style="--_ds-aria-label: 'Forrige side'"></button></li>
          <li><button class="ds-button"></button></li>
          <li><button class="ds-button"></button></li>
          <li><button class="ds-button" data-testid="next" style="--_ds-aria-label: 'Neste side'"></button></li>
        </ol>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination');
    const prev = paginationEl?.querySelector('[data-testid="prev"]');
    const next = paginationEl?.querySelector('[data-testid="next"]');

    await tick(); // Let mutation observer run
    expect(prev).toHaveAttribute('aria-label', 'Forrige side');
    expect(next).toHaveAttribute('aria-label', 'Neste side');
  });

  it('marks hidden steps as not focusable', async () => {
    document.body.innerHTML = `
      <ds-pagination data-current="1" data-total="100" data-href="/page/%d" aria-label="Pagination">
     <ol>
        <li><button class="ds-button">prev</button></li>
        <li><button class="ds-button">1</button></li>
        <li><button class="ds-button">2</button></li>
        <li><button class="ds-button">3</button></li>
        <li><button class="ds-button">4</button></li>
        <li><button class="ds-button">5</button></li>
        <li><button class="ds-button">next</button></li>
      </ol>
      </ds-pagination>
    `;

    const paginationEl = document.querySelector('ds-pagination');
    const links = paginationEl?.querySelectorAll('button');
    const hidden = links?.[4];

    await tick(); // Let mutation observer run
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
