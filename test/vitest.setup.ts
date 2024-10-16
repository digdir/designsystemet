import { expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

import { mockMediaQuery } from './testUtils';

expect.extend(matchers);

// @floating-ui in popover-component uses resizeobserver, which is not supported in jsdom.
// This is a simple mock to not break the tests.
class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = ResizeObserver;

HTMLDialogElement.prototype.show = vi.fn(function mock(
  this: HTMLDialogElement,
) {
  this.open = true;
});

HTMLDialogElement.prototype.showModal = vi.fn(function mock(
  this: HTMLDialogElement,
) {
  this.open = true;
});

HTMLDialogElement.prototype.close = vi.fn(function mock(
  this: HTMLDialogElement,
) {
  this.open = false;
  /* dispatch close event */
  this.dispatchEvent(new Event('close'));
});

/* add support for checking ESC key */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const dialog = document.querySelector('dialog');
    dialog?.close();
  }
});

// Add support for dialog form method
document.addEventListener('click', ({ target }) => {
  if (target instanceof HTMLElement)
    target
      .closest('form[method="dialog"] button[type="submit"]')
      ?.closest('dialog')
      ?.close();
});

const { setScreenWidth } = mockMediaQuery(800);
setScreenWidth(800);

if (!('popover' in HTMLElement.prototype)) {
  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>[popover]:not([data-popping]){display:none!important}</style>`,
  );

  // @ts-ignore
  Object.defineProperties(HTMLElement.prototype, {
    popover: {
      get() {
        if (!this.hasAttribute('popover')) return null;
        const value = (this.getAttribute('popover') || '').toLowerCase();
        if (value === '' || value === 'auto') return 'auto';
        return 'manual';
      },
      set(value) {
        this.setAttribute('popover', value);
      },
    },
    showPopover: {
      value() {
        this.toggleAttribute('data-popping', true);
      },
    },
    hidePopover: {
      value() {
        this.toggleAttribute('data-popping', false);
      },
    },
    togglePopover: {
      value(state?: boolean) {
        this.toggleAttribute('data-popping', state);
      },
    },
  });
}
