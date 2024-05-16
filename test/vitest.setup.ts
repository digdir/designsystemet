import { vi, expect } from 'vitest';
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
});

const { setScreenWidth } = mockMediaQuery(800);
setScreenWidth(800);
