import { expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

import { mockMediaQuery } from './testUtils';

expect.extend(matchers);

/**
 * Mock of Dialog element for testing purposes
 */

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
