import { renderHook } from '@testing-library/react';
import type { VitestUtils } from 'vitest';
import { vi } from 'vitest';

import { useMediaQuery } from './useMediaQuery';

// Test data:
const query = '(min-width: 600px)';

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([true, false])('Returns value from window.matchMedia.matches when it is %s', (matches) => {
    const matchMediaValue = matchMediaValueMock({ matches });
    const { result } = renderHook(() => useMediaQuery(query));
    expect(matchMediaValue).toHaveBeenCalledWith(query);
    expect(result.current).toBe(matches);
  });

  it('Adds event listener', () => {
    const addEventListener = vi.fn();
    matchMediaValueMock({ addEventListener });
    renderHook(() => useMediaQuery(query));
    expect(addEventListener).toHaveBeenCalledTimes(1);
  });

  it('Removes the event listener on unmount', () => {
    const removeEventListener = vi.fn();
    matchMediaValueMock({ removeEventListener });
    const { unmount } = renderHook(() => useMediaQuery(query));
    expect(removeEventListener).not.toHaveBeenCalled();
    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });
});

const matchMediaValueMock = ({
  matches,
  addEventListener,
  removeEventListener,
}: Partial<{
  matches: boolean;
  addEventListener: VitestUtils['fn'];
  removeEventListener: VitestUtils['fn'];
}>) => {
  const value = vi.fn().mockImplementation((query: string) => ({
    matches: matches ?? false,
    media: query,
    onchange: null,
    addEventListener: addEventListener ?? vi.fn(),
    removeEventListener: removeEventListener ?? vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  Object.defineProperty(window, 'matchMedia', { writable: true, value });
  return value;
};
