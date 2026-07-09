/// <reference types="@testing-library/jest-dom" />

import { describe, expect, it, vi } from 'vitest';

const renderAndResize = async () => {
  vi.useFakeTimers();
  window.dispatchEvent(new Event('resize'));
  await vi.advanceTimersByTimeAsync(120);
  vi.useRealTimers();
};

const setOffsetHeight = (el: Element | null | undefined, value: number) => {
  if (!el) throw new Error('Expected element to exist');
  Object.defineProperty(el, 'offsetHeight', { value, configurable: true });
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

    setOffsetHeight(lastLink, 10);

    await renderAndResize();

    expect(breadcrumbs).toHaveAttribute('role', 'navigation');
    expect(breadcrumbs?.querySelector('a')).not.toHaveAttribute('aria-current');
    expect(lastLink).toHaveAttribute('aria-current', 'page');
  });

  it('caches aria-label and removes it when list is hidden', async () => {
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
    setOffsetHeight(lastLink, 0);
    await renderAndResize();

    expect(breadcrumbs?._label.value).toBe('Breadcrumbs');
    expect(breadcrumbs).not.toHaveAttribute('aria-label');
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

    setOffsetHeight(lastLink, 0);

    await renderAndResize();
    expect(breadcrumbs).not.toHaveAttribute('aria-label');
    expect(breadcrumbs?._label.value).toBe('Breadcrumbs');

    setOffsetHeight(lastLink, 10);

    await renderAndResize();
    expect(breadcrumbs).toHaveAttribute('aria-label', 'Breadcrumbs');
  });

  it('supports aria-labelledby and caches it when list is hidden', async () => {
    document.body.innerHTML = `
      <h1 id="bc-title">You are here</h1>
      <ds-breadcrumbs aria-labelledby="bc-title">
        <ol>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
        </ol>
      </ds-breadcrumbs>
    `;

    const breadcrumbs = document.querySelector('ds-breadcrumbs');
    const lastLink = [...(breadcrumbs?.querySelectorAll('a') || [])].pop();

    setOffsetHeight(lastLink, 10);
    await renderAndResize();

    expect(breadcrumbs).toHaveAttribute('aria-labelledby', 'bc-title');
    expect(breadcrumbs).not.toHaveAttribute('aria-label');
    expect(breadcrumbs?._label.key).toBe('aria-labelledby');
    expect(breadcrumbs?._label.value).toBe('bc-title');

    // Hide the list
    setOffsetHeight(lastLink, 0);
    await renderAndResize();

    expect(breadcrumbs).not.toHaveAttribute('aria-labelledby');
    expect(breadcrumbs).not.toHaveAttribute('aria-label');
    expect(breadcrumbs?._label.value).toBe('bc-title');

    // Show the list again
    setOffsetHeight(lastLink, 10);
    await renderAndResize();

    expect(breadcrumbs).toHaveAttribute('aria-labelledby', 'bc-title');
    expect(breadcrumbs).not.toHaveAttribute('aria-label');
  });

  it('switches from aria-label to aria-labelledby at runtime', async () => {
    document.body.innerHTML = `
      <h1 id="bc-title">You are here</h1>
      <ds-breadcrumbs aria-label="Breadcrumbs">
        <ol>
          <li><a href="/a">A</a></li>
          <li><a href="/b">B</a></li>
        </ol>
      </ds-breadcrumbs>
    `;

    const breadcrumbs = document.querySelector('ds-breadcrumbs');
    const lastLink = [...(breadcrumbs?.querySelectorAll('a') || [])].pop();

    setOffsetHeight(lastLink, 10);
    await renderAndResize();

    expect(breadcrumbs).toHaveAttribute('aria-label', 'Breadcrumbs');
    expect(breadcrumbs?._label.key).toBe('aria-label');

    // Switch to aria-labelledby
    breadcrumbs?.setAttribute('aria-labelledby', 'bc-title');
    breadcrumbs?.removeAttribute('aria-label');
    await renderAndResize();

    expect(breadcrumbs).toHaveAttribute('aria-labelledby', 'bc-title');
    expect(breadcrumbs).not.toHaveAttribute('aria-label');
    expect(breadcrumbs?._label.key).toBe('aria-labelledby');
    expect(breadcrumbs?._label.value).toBe('bc-title');

    // Switch back to aria-label
    breadcrumbs?.setAttribute('aria-label', 'Breadcrumbs');
    breadcrumbs?.removeAttribute('aria-labelledby');
    await renderAndResize();

    expect(breadcrumbs).toHaveAttribute('aria-label', 'Breadcrumbs');
    expect(breadcrumbs).not.toHaveAttribute('aria-labelledby');
    expect(breadcrumbs?._label.key).toBe('aria-label');
    expect(breadcrumbs?._label.value).toBe('Breadcrumbs');
  });

  it('does not set navigation role when list is hidden', async () => {
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
    expect(breadcrumbs).toHaveAttribute('role', 'navigation');

    setOffsetHeight(lastLink, 0);
    await renderAndResize();
    expect(breadcrumbs).not.toHaveAttribute('role');

    setOffsetHeight(lastLink, 10);
    await renderAndResize();
    expect(breadcrumbs).toHaveAttribute('role', 'navigation');
  });

  it('ignores anchors that are direct children of ds-breadcrumbs', async () => {
    document.body.innerHTML = `
      <ds-breadcrumbs aria-label="Breadcrumbs">
        <a href="/x">Direct child</a>
      </ds-breadcrumbs>
    `;

    const breadcrumbs = document.querySelector('ds-breadcrumbs');
    const link = breadcrumbs?.querySelector('a');

    setOffsetHeight(link, 10);
    await renderAndResize();

    expect(breadcrumbs).not.toHaveAttribute('role');
    expect(breadcrumbs).not.toHaveAttribute('aria-label');
    expect(link).not.toHaveAttribute('aria-current');
  });
});
