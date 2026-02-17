/// <reference types="@testing-library/jest-dom" />

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setTooltipElement } from './tooltip';

const DELAY_HOVER = 300;
const DELAY_SKIP = 300;

type TooltipElement = HTMLElement & {
  showPopover: () => void;
  hidePopover: () => void;
  popover?: string;
};

const createTooltip = (): TooltipElement => {
  const tip = document.createElement('div') as TooltipElement;
  tip.showPopover = vi.fn(() => {
    tip.popover = 'manual';
  });
  tip.hidePopover = vi.fn();
  return tip;
};

const resetTooltipState = async (tip: TooltipElement) => {
  if (!tip.isConnected) document.body.appendChild(tip);
  const event = new Event('toggle', { bubbles: true }) as Event & {
    newState?: string;
  };
  event.newState = 'closed';
  tip.dispatchEvent(event);
  await vi.advanceTimersByTimeAsync(DELAY_SKIP);
};

beforeEach(() => {
  window.dsWarnings = false;
});

afterEach(() => {
  delete (window as Window & { dsWarnings?: boolean }).dsWarnings;
  setTooltipElement(null);
});

describe('tooltip behavior', () => {
  it('sets aria-label when element has no text', async () => {
    document.body.innerHTML = `<button data-tooltip="Help"></button>`;

    const el = document.querySelector('button') as HTMLElement;

    await vi.waitUntil(() => el.hasAttribute('aria-label'), 2000); // Wait for mutation observer

    expect(el).toHaveAttribute('aria-label', 'Help');
    expect(el).not.toHaveAttribute('aria-description');
  });

  it('sets aria-description when element has text', async () => {
    document.body.innerHTML = `<button data-tooltip="Help">Label</button>`;

    const el = document.querySelector('button') as HTMLElement;

    await vi.waitUntil(() => el.hasAttribute('aria-description'), 2000); // Wait for mutation observer

    expect(el).toHaveAttribute('aria-description', 'Help');
    expect(el).not.toHaveAttribute('aria-label');
  });

  it('shows tooltip on focus and syncs text', async () => {
    const tip = createTooltip();
    setTooltipElement(tip);
    await resetTooltipState(tip);

    document.body.innerHTML = `<button data-tooltip="More info">Button</button>`;

    const button = document.querySelector('button') as HTMLButtonElement;
    await vi.waitUntil(() => button.hasAttribute('aria-description'), 2000); // Wait for mutation observer

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
  });

  it('delays tooltip on first mouseover', async () => {
    const tip = createTooltip();
    setTooltipElement(tip);
    await resetTooltipState(tip);

    document.body.innerHTML = `<button data-tooltip="Hover">Hover</button>`;

    const button = document.querySelector('button') as HTMLButtonElement;

    button.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(tip.showPopover).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(DELAY_HOVER - 100);
    expect(tip.showPopover).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(100);
    expect(tip.showPopover).toHaveBeenCalledTimes(1);
  });

  it('hides tooltip on Escape', async () => {
    const tip = createTooltip();
    setTooltipElement(tip);
    await resetTooltipState(tip);

    document.body.innerHTML = `<button data-tooltip="Close">Close</button>`;

    const button = document.querySelector('button') as HTMLButtonElement;

    button.dispatchEvent(new FocusEvent('focus'));

    expect(tip.showPopover).toHaveBeenCalledTimes(1);

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );

    expect(tip.hidePopover).toHaveBeenCalledTimes(1);
  });
});
