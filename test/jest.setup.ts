import '@testing-library/jest-dom';

import { mockMediaQuery } from './testUtils';

// @floating-ui in popover-component uses resizeobserver, which is not supported in jsdom.
// This is a simple mock to not break the tests.
class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
window.ResizeObserver = ResizeObserver;

const { setScreenWidth } = mockMediaQuery(800);
setScreenWidth(800);
