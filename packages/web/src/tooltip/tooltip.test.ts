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
});
