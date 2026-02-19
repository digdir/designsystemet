import { expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

/**
 * Mock of Dialog element for testing purposes
 */
HTMLDialogElement.prototype.close = vi.fn(function mock(
  this: HTMLDialogElement,
) {
  /* Only dispatch close event if dialog was open (matching browser behavior) */
  if (this.open) {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  }
});

/* add support for checking ESC key */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const dialog = document.querySelector('dialog');
    dialog?.close();
  }
});
