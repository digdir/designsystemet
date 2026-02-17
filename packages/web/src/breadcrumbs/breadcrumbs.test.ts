/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';

const renderAndResize = async () => {
  window.dispatchEvent(new Event('resize'));
  await vi.advanceTimersByTimeAsync(120);
};

describe('Breadcrumbs component', () => {
  it('sets role and aria-current when list is visible', async () => {
    document.body.innerHTML = `
      <ds-breadcrumbs aria-label="Breadcrumbs">
        <ol>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
        </ol>
      </ds-breadcrumbs>
    `;

    const breadcrumbs = document.querySelector('ds-breadcrumbs') as HTMLElement;
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'));
    const last = links[links.length - 1];

    Object.defineProperty(last, 'offsetHeight', {
      value: 10,
      configurable: true,
    });

    await renderAndResize();

    expect(breadcrumbs).toHaveAttribute('role', 'navigation');
    expect(links[0]).not.toHaveAttribute('aria-current');
    expect(last).toHaveAttribute('aria-current', 'page');
  });

  it('moves aria-label to data-label when list is hidden', async () => {
    document.body.innerHTML = `
      <ds-breadcrumbs aria-label="Breadcrumbs">
        <ol>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
        </ol>
      </ds-breadcrumbs>
    `;

    const breadcrumbs = document.querySelector('ds-breadcrumbs') as HTMLElement;
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'));
    const last = links[links.length - 1];

    Object.defineProperty(last, 'offsetHeight', {
      value: 0,
      configurable: true,
    });

    await renderAndResize();
    await vi.waitUntil(() => breadcrumbs.hasAttribute('data-label')); // Wait for mutation observer

    expect(breadcrumbs).not.toHaveAttribute('aria-label', 'Breadcrumbs');
    expect(breadcrumbs).toHaveAttribute('data-label', 'Breadcrumbs');
  });

  it('restores aria-label when list becomes visible again', async () => {
    document.body.innerHTML = `
      <ds-breadcrumbs data-label="Breadcrumbs">
        <ol>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
        </ol>
      </ds-breadcrumbs>
    `;

    const breadcrumbs = document.querySelector('ds-breadcrumbs') as HTMLElement;
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'));
    const last = links[links.length - 1];

    Object.defineProperty(last, 'offsetHeight', {
      value: 0,
      configurable: true,
    });

    await renderAndResize();
    await vi.waitUntil(() => breadcrumbs.hasAttribute('data-label')); // Wait for mutation observer

    expect(breadcrumbs).not.toHaveAttribute('aria-label', 'Breadcrumbs');
    expect(breadcrumbs).toHaveAttribute('data-label', 'Breadcrumbs');

    Object.defineProperty(last, 'offsetHeight', {
      value: 10,
      configurable: true,
    });

    await renderAndResize();
    await vi.waitUntil(() => breadcrumbs.hasAttribute('aria-label')); // Wait for mutation observer

    expect(breadcrumbs).toHaveAttribute('aria-label', 'Breadcrumbs');
    // expect(breadcrumbs).not.toHaveAttribute('data-label'); TODO - data-label is not removed when aria-label is restored, should it be?
  });
});
