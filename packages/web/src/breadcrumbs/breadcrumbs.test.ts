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

    const breadcrumbs = document.querySelector('ds-breadcrumbs');
    const lastLink = [...(breadcrumbs?.querySelectorAll('a') || [])].pop();

    Object.defineProperty(lastLink, 'offsetHeight', {
      value: 10,
      configurable: true,
    });

    await renderAndResize();

    expect(breadcrumbs).toHaveAttribute('role', 'navigation');
    expect(breadcrumbs?.querySelector('a')).not.toHaveAttribute('aria-current');
    expect(lastLink).toHaveAttribute('aria-current', 'page');
  });

  it('moves aria-label to _label when list is hidden', async () => {
    document.body.innerHTML = `
      <ds-breadcrumbs aria-label="Breadcrumbs">
        <ol>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
        </ol>
      </ds-breadcrumbs>
    `;

    const breadcrumbs = document.querySelector('ds-breadcrumbs');
    const lastLink = [...(breadcrumbs?.querySelectorAll('a') || [])].pop();

    // Fake window resized
    Object.defineProperty(lastLink, 'offsetHeight', {
      value: 0,
      configurable: true,
    });
    await renderAndResize();

    expect(await vi.waitUntil(() => breadcrumbs?._label)).toBeTruthy();
    expect(breadcrumbs).not.toHaveAttribute('aria-label', 'Breadcrumbs');
  });

  it('restores aria-label when list becomes visible again', async () => {
    document.body.innerHTML = `
      <ds-breadcrumbs aria-label="Breadcrumbs">
        <ol>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
        </ol>
      </ds-breadcrumbs>
    `;

    const breadcrumbs = document.querySelector('ds-breadcrumbs');
    const lastLink = [...(breadcrumbs?.querySelectorAll('a') || [])].pop();

    Object.defineProperty(lastLink, 'offsetHeight', {
      value: 0,
      configurable: true,
    });

    await renderAndResize();
    await vi.waitUntil(() => breadcrumbs?._label); // Wait for mutation observer

    expect(breadcrumbs).not.toHaveAttribute('aria-label', 'Breadcrumbs');
    expect(breadcrumbs?._label).toBe('Breadcrumbs');

    Object.defineProperty(lastLink, 'offsetHeight', {
      value: 10,
      configurable: true,
    });

    await renderAndResize();
    await vi.waitUntil(() => breadcrumbs?.hasAttribute('aria-label')); // Wait for mutation observer

    expect(breadcrumbs).toHaveAttribute('aria-label', 'Breadcrumbs');
  });
});
