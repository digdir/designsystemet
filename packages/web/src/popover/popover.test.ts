/// <reference types="@testing-library/jest-dom" />

import { afterEach, describe, expect, it, vi } from 'vitest';

const render = (html: string) => {
  document.body.innerHTML = html;
};

// Wait a tick for autoUpdate()'s initial computePosition() (a microtask) to resolve
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('popover floating behavior', () => {
  it('does not apply floating styles when --_ds-floating is not set', async () => {
    render(`
      <button popovertarget="my-popover">Open</button>
      <div id="my-popover" popover="auto">Content</div>
    `);

    const trigger = document.querySelector('button') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;

    trigger.click();
    await tick();

    expect(popover.matches(':popover-open')).toBe(true);
    expect(popover).not.toHaveAttribute('data-floating');
    expect(popover.style.translate).toBe('');
  });

  it('positions the popover using floating-ui when --_ds-floating is set', async () => {
    render(`
      <button popovertarget="my-popover">Open</button>
      <div id="my-popover" popover="auto" style="--_ds-floating: top">Content</div>
    `);

    const trigger = document.querySelector('button') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;

    trigger.click();
    await tick();

    expect(popover.matches(':popover-open')).toBe(true);
    expect(popover).toHaveAttribute('data-floating');
    expect(popover.style.translate).not.toBe('');
    expect(popover.style.getPropertyValue('--_ds-floating-arrow-x')).not.toBe(
      '',
    );
    expect(popover.style.getPropertyValue('--_ds-floating-arrow-y')).not.toBe(
      '',
    );
  });

  it('respects data-placement on the popover', async () => {
    render(`
      <button popovertarget="my-popover">Open</button>
      <div
        id="my-popover"
        popover="auto"
        data-placement="bottom-end"
        style="--_ds-floating: top"
      >Content</div>
    `);

    document.querySelector('button')?.click();
    await tick();

    const popover = document.getElementById('my-popover') as HTMLElement;
    expect(popover).toHaveAttribute('data-floating', 'bottom-end');
  });

  it('defers dimension changes to avoid resizing during ResizeObserver delivery', async () => {
    const animationFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    render(`
      <button style="width: 120px" popovertarget="my-popover">Open</button>
      <div
        id="my-popover"
        popover="auto"
        style="--_ds-floating: top; --_ds-floating-overscroll: fit"
      >Content</div>
    `);

    document.querySelector('button')?.click();
    await tick();

    const popover = document.getElementById('my-popover') as HTMLElement;
    expect(animationFrames.length).toBeGreaterThan(0);
    expect(popover.style.width).toBe('');
    expect(popover.style.maxHeight).toBe('');

    animationFrames.forEach((callback) => {
      callback(performance.now());
    });

    expect(popover.style.width).toBe('120px');
    expect(popover.style.maxHeight).not.toBe('');
  });

  it('does not position when data-placement is "none"', async () => {
    render(`
      <button popovertarget="my-popover">Open</button>
      <div
        id="my-popover"
        popover="auto"
        data-placement="none"
        style="--_ds-floating: top"
      >Content</div>
    `);

    document.querySelector('button')?.click();
    await tick();

    const popover = document.getElementById('my-popover') as HTMLElement;
    expect(popover).not.toHaveAttribute('data-floating');
    expect(popover.style.translate).toBe('');
  });

  it('cleans up positioning (autoUpdate) when the popover closes', async () => {
    render(`
      <button popovertarget="my-popover">Open</button>
      <div id="my-popover" popover="auto" style="--_ds-floating: top">Content</div>
    `);

    const trigger = document.querySelector('button') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;

    trigger.click();
    await tick();
    expect(popover.matches(':popover-open')).toBe(true);

    trigger.click(); // Close
    await tick();
    expect(popover.matches(':popover-open')).toBe(false);
  });

  it('resolves source via [commandfor] when no explicit source is given', async () => {
    render(`
      <button commandfor="my-popover" command="toggle-popover">Open</button>
      <div id="my-popover" popover="auto" style="--_ds-floating: top">Content</div>
    `);

    document.querySelector('button')?.click();
    await tick();

    const popover = document.getElementById('my-popover') as HTMLElement;
    expect(popover.matches(':popover-open')).toBe(true);
    expect(popover).toHaveAttribute('data-floating');
  });
});

describe('popover shadow DOM support', () => {
  it('positions a popover triggered from inside a shadow root', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <button popovertarget="shadow-popover">Open</button>
      <div id="shadow-popover" popover="auto" style="--_ds-floating: top">Content</div>
    `;

    const trigger = root.querySelector('button') as HTMLButtonElement;
    const popover = root.getElementById('shadow-popover') as HTMLElement;

    trigger.click();
    await tick();

    expect(popover.matches(':popover-open')).toBe(true);
    expect(popover).toHaveAttribute('data-floating');
    expect(popover.style.translate).not.toBe('');
  });
});

describe('popover scrollbar interaction guard', () => {
  it('re-shows the popover if pointerdown+scroll+pointerup happens while open', async () => {
    render(`
      <button popovertarget="my-popover">Open</button>
      <div id="my-popover" popover="auto" style="--_ds-floating: top">Content</div>
    `);

    const trigger = document.querySelector('button') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;

    trigger.click();
    await tick();
    expect(popover.matches(':popover-open')).toBe(true);

    const showSpy = vi.spyOn(popover, 'showPopover');

    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    document.dispatchEvent(new Event('scroll', { bubbles: true }));
    document.dispatchEvent(new Event('pointerup', { bubbles: true }));

    expect(showSpy).toHaveBeenCalledTimes(1);
  });

  it('does not re-show the popover on a click without scrolling', async () => {
    render(`
      <button popovertarget="my-popover">Open</button>
      <div id="my-popover" popover="auto" style="--_ds-floating: top">Content</div>
    `);

    const trigger = document.querySelector('button') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;

    trigger.click();
    await tick();

    const showSpy = vi.spyOn(popover, 'showPopover');

    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    document.dispatchEvent(new Event('pointerup', { bubbles: true }));

    expect(showSpy).not.toHaveBeenCalled();
  });
});

describe('popover overscroll sizing', () => {
  const renderScrollable = () =>
    render(`
      <button popovertarget="my-popover">Open</button>
      <div
        id="my-popover"
        popover="auto"
        style="--_ds-floating: bottom; --_ds-floating-overscroll: contain"
      >Content</div>
      <div style="height: 3000px"></div>
    `);

  afterEach(() => window.scrollTo(0, 0));

  it('keeps the max-height calculated at open when scrolling', async () => {
    renderScrollable();

    const trigger = document.querySelector('button') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;

    trigger.click();
    await tick();

    await vi.waitFor(() => expect(popover.style.maxHeight).toMatch(/px$/));
    const sizeAtOpen = popover.style.maxHeight;
    expect(sizeAtOpen).toMatch(/px$/);

    // Scroll so the available height below the trigger changes, then wait
    // for autoUpdate's recompute (arrowPseudo calls setProperty on each run)
    const setPropertySpy = vi.spyOn(popover.style, 'setProperty');
    window.scrollTo(0, 300);
    await vi.waitFor(() => expect(setPropertySpy).toHaveBeenCalled());
    await new Promise((resolve) => setTimeout(resolve, 50)); // Let the full middleware pass (including size) settle

    expect(popover.style.maxHeight).toBe(sizeAtOpen);
  });

  it('recalculates the max-height when the popover is re-opened', async () => {
    renderScrollable();

    const trigger = document.querySelector('button') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;

    trigger.click();
    await tick();
    await vi.waitFor(() => expect(popover.style.maxHeight).toMatch(/px$/));
    const sizeAtFirstOpen = popover.style.maxHeight;

    trigger.click(); // Close
    await tick();
    window.scrollTo(0, 300); // Trigger is now above the viewport, so available height below it is larger
    trigger.click();
    await tick();

    await vi.waitFor(() =>
      expect(popover.style.maxHeight).not.toBe(sizeAtFirstOpen),
    );
    expect(popover.style.maxHeight).toMatch(/px$/);
  });
});

describe('popover duplicate toggle guard', () => {
  it('does not run positioning twice when togglePopover() is followed synchronously by a ds-toggle-source event', async () => {
    // Mirrors React's Popover, which calls togglePopover() and then dispatches
    // "ds-toggle-source" right after, to relay the .source in browsers lacking
    // native ToggleEvent.source support. Both trigger this module's toggle().
    // floating-ui's autoUpdate() constructs a ResizeObserver for each call, so
    // counting constructor calls gives a deterministic signal for whether
    // positioning was set up once (fixed) or twice (regression).
    render(`
      <button id="trigger" popovertarget="my-popover">Open</button>
      <div id="my-popover" popover="manual" style="--_ds-floating: top">Content</div>
    `);

    const trigger = document.getElementById('trigger') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;
    const OriginalResizeObserver = window.ResizeObserver;
    const resizeObserverSpy = vi
      .spyOn(window, 'ResizeObserver')
      .mockImplementation(function (
        this: unknown,
        callback: ResizeObserverCallback,
      ) {
        return new OriginalResizeObserver(callback); // Delegate to the real observer so autoUpdate() still works
      });

    popover.togglePopover({ force: true, source: trigger });
    popover.dispatchEvent(
      new CustomEvent('ds-toggle-source', {
        bubbles: true,
        composed: true,
        detail: trigger,
      }),
    );
    await tick();

    expect(popover.matches(':popover-open')).toBe(true);
    expect(popover).toHaveAttribute('data-floating');
    // floating-ui's autoUpdate() creates 2 ResizeObservers (reference + floating
    // element) per call. A regression (positioning running twice) would double this.
    expect(resizeObserverSpy.mock.calls.length).toBe(2);
  });

  it('still positions correctly on a later, separate toggle after the same-tick duplicate is skipped', async () => {
    render(`
      <button id="trigger" popovertarget="my-popover">Open</button>
      <div id="my-popover" popover="manual" style="--_ds-floating: top">Content</div>
    `);

    const trigger = document.getElementById('trigger') as HTMLButtonElement;
    const popover = document.getElementById('my-popover') as HTMLElement;

    popover.togglePopover(true);
    popover.dispatchEvent(
      new CustomEvent('ds-toggle-source', {
        bubbles: true,
        composed: true,
        detail: trigger,
      }),
    );
    await tick();
    popover.hidePopover();
    await tick();

    popover.togglePopover(true);
    await tick();

    expect(popover.matches(':popover-open')).toBe(true);
    expect(popover).toHaveAttribute('data-floating');
    expect(popover.style.translate).not.toBe('');
  });
});
