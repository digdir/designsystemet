/// <reference types="@testing-library/jest-dom" />

import { afterEach, describe, expect, it, vi } from 'vitest';
import { setTooltipElement } from './tooltip';

const DELAY_HOVER = 300;

afterEach(() => {
  setTooltipElement(null); // Reset tooltip between tests
  document.querySelector('ds-tooltip')?.remove(); // Remove tooltip element between tests
});

describe('tooltip behavior', () => {
  it('sets aria-label when element has no text', async () => {
    document.body.innerHTML = `<button data-tooltip="Help"></button>`;

    const el = document.querySelector('button') as HTMLElement;
    await new Promise((resolve) => setTimeout(resolve, 0)); // Let MutationObserver run

    expect(el).toHaveAttribute('aria-label', 'Help');
    expect(el).not.toHaveAttribute('aria-description');
  });

  it('sets aria-description when element has text', async () => {
    document.body.innerHTML = `<button data-tooltip="Help">Label</button>`;

    const el = document.querySelector('button') as HTMLElement;
    await new Promise((resolve) => setTimeout(resolve, 0)); // Let MutationObserver run

    expect(el).toHaveAttribute('aria-description', 'Help');
    expect(el).not.toHaveAttribute('aria-label');
  });

  it('shows tooltip on focus and syncs text', async () => {
    const tip = document.createElement('div');
    tip.showPopover = vi.fn();
    tip.hidePopover = vi.fn();
    setTooltipElement(tip);

    document.body.innerHTML = `<button data-tooltip="More info">Button</button>`;

    const button = document.querySelector('button') as HTMLButtonElement;
    await new Promise((resolve) => setTimeout(resolve, 0)); // Let mutation observer run

    let eventSource: Element | undefined;
    tip.addEventListener('ds-toggle-source', (event) => {
      eventSource = (event as CustomEvent<Element>).detail;
    });

    button.dispatchEvent(new FocusEvent('focus'));

    expect(tip.showPopover).toHaveBeenCalledTimes(1);
    expect(tip.textContent).toBe('More info');
    expect(tip.getAttribute('popover')).toBe('manual');
    expect(button).toHaveAttribute('aria-description', 'More info');
    expect(eventSource).toBe(button);
    setTooltipElement(null); // Reset
    tip.remove(); // Remove element
  });

  it('delays tooltip on first mouseover', async () => {
    vi.useFakeTimers();
    const tip = document.createElement('div');
    tip.showPopover = vi.fn();
    tip.hidePopover = vi.fn();
    setTooltipElement(tip);

    document.body.innerHTML = `<button data-tooltip="Hover">Hover</button>`;

    const button = document.querySelector('button') as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(tip.showPopover).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(DELAY_HOVER - 100);
    expect(tip.showPopover).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);
    expect(tip.showPopover).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('hides tooltip on Escape', async () => {
    const tip = document.createElement('div');
    tip.showPopover = vi.fn();
    tip.hidePopover = vi.fn();
    setTooltipElement(tip);

    document.body.innerHTML = `<button data-tooltip="Close">Close</button>`;

    const button = document.querySelector('button') as HTMLButtonElement;
    button.focus();
    expect(tip.showPopover).toHaveBeenCalledTimes(1);

    const esc = { key: 'Escape', bubbles: true };
    document.dispatchEvent(new KeyboardEvent('keydown', esc));
    expect(tip.hidePopover).toHaveBeenCalledTimes(1);
  });

  it('updates tooltip text and announces when data-tooltip changes programmatically', async () => {
    const tip = document.createElement('div');
    setTooltipElement(tip);

    document.body.innerHTML = `<button data-testid='hei' data-tooltip="Original">Label</button>`;

    const button = document.querySelector('button') as HTMLButtonElement;
    await new Promise((resolve) => setTimeout(resolve, 0)); // Let MutationObserver run
    expect(button).toHaveAttribute('aria-description', 'Original');
    expect(tip.textContent).not.toBe('Original');

    button.focus();
    expect(tip).toBeVisible();
    expect(tip.textContent).toBe('Original');

    // Change tooltip text programmatically
    expect(button).toHaveFocus();
    button.setAttribute('data-tooltip', 'Updated');
    await new Promise((resolve) => setTimeout(resolve, 100)); // Let MutationObserver run
    expect(tip.textContent).toBe('Updated');
    expect(button).toHaveAttribute('aria-description', 'Updated');

    // Should exist a live region with the updated text to announce the change
    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion?.textContent).toContain('Updated');
  });

  // Regression: previously used `return` instead of `continue`, which would abort
  // processing of all subsequent tooltip elements when an empty data-tooltip was encountered.
  it('processes all tooltip elements even when one has empty data-tooltip', async () => {
    window.dsWarnings = false; // Suppress expected warning about empty tooltip
    document.body.innerHTML = `
      <button id="first" data-tooltip="" style="--_ds-data-tooltip: 'First tooltip'">First</button>
      <button id="second" data-tooltip="Second tooltip">Second</button>
    `;
    await new Promise((resolve) => setTimeout(resolve, 0));

    const first = document.getElementById('first') as HTMLElement;
    const second = document.getElementById('second') as HTMLElement;
    expect(first).toHaveAttribute('aria-description', 'First tooltip');
    expect(second).toHaveAttribute('aria-description', 'Second tooltip');
    window.dsWarnings = false; // Re-enable warnings for subsequent tests
  });

  it('hides tooltip when source loses focus', async () => {
    const tip = document.createElement('div');
    tip.showPopover = vi.fn();
    tip.hidePopover = vi.fn();
    setTooltipElement(tip);

    document.body.innerHTML = `<button data-tooltip="Bye">Bye</button>`;

    const button = document.querySelector('button') as HTMLButtonElement;
    button.dispatchEvent(new FocusEvent('focus'));
    expect(tip.showPopover).toHaveBeenCalledTimes(1);

    button.dispatchEvent(new FocusEvent('blur'));
    expect(tip.hidePopover).toHaveBeenCalledTimes(1);
  });

  // Switching from one source to another while tooltip is open used
  // to call showPopover() again, which throws InvalidStateError per the popover spec.
  it('does not throw when switching between two open tooltip sources', async () => {
    document.body.innerHTML = `
      <button id="a" data-tooltip="A">A</button>
      <button id="b" data-tooltip="B">B</button>
    `;
    await new Promise((resolve) => setTimeout(resolve, 0));

    const a = document.querySelector('#a') as HTMLButtonElement;
    const b = document.querySelector('#b') as HTMLButtonElement;

    a.focus();
    const tip = document.querySelector('.ds-tooltip');

    expect(tip).toBeInTheDocument();
    expect(tip?.textContent).toBe('A');
    // Switching focus should not throw and should update content
    expect(() => b.focus()).not.toThrow();
    expect(tip?.textContent).toBe('B');
  });

  it('hides tooltip when source element is removed from DOM', async () => {
    const tip = document.createElement('div');
    tip.showPopover = vi.fn();
    tip.hidePopover = vi.fn();
    setTooltipElement(tip);

    document.body.innerHTML = `<button data-tooltip="Vanish">Vanish</button>`;
    const button = document.querySelector('button') as HTMLButtonElement;
    button.focus();
    expect(tip.showPopover).toHaveBeenCalledTimes(1);

    button.remove();
    await new Promise((resolve) => setTimeout(resolve, 10)); // Let MutationObserver run
    expect(tip.hidePopover).toHaveBeenCalledTimes(1);
  });

  it('hides previous tooltip element when setTooltipElement is called with a new element', async () => {
    const tip1 = document.createElement('div');
    tip1.showPopover = vi.fn();
    tip1.hidePopover = vi.fn();
    setTooltipElement(tip1);

    document.body.innerHTML = `<button data-tooltip="Swap">Swap</button>`;
    const button = document.querySelector('button') as HTMLButtonElement;
    button.focus();
    expect(tip1.showPopover).toHaveBeenCalledTimes(1);

    const tip2 = document.createElement('div');
    tip2.showPopover = vi.fn();
    tip2.hidePopover = vi.fn();
    setTooltipElement(tip2);

    expect(tip1.hidePopover).toHaveBeenCalledTimes(1);
  });

  it('re-shows tooltip on the same element after it has been hidden', async () => {
    const tip = document.createElement('div');
    tip.showPopover = vi.fn();
    tip.hidePopover = vi.fn();
    setTooltipElement(tip);

    document.body.innerHTML = `
      <button id="src" data-tooltip="Again">Again</button>
      <button id="other">Other</button>
    `;
    const button = document.querySelector('#src') as HTMLButtonElement;
    const other = document.querySelector('#other') as HTMLButtonElement;

    button.focus();
    expect(tip.showPopover).toHaveBeenCalledTimes(1);

    // Simulate focus leaving source by dispatching a focus event from a
    // sibling element with no tooltip (which triggers the "no source" hide path)
    other.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    expect(tip.hidePopover).toHaveBeenCalledTimes(1);

    button.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    expect(tip.showPopover).toHaveBeenCalledTimes(2);
  });
});
