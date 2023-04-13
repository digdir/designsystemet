import { renderHook } from '@testing-library/react';

import { useMediaQuery } from './useMediaQuery';

// Test data:
const query = '(min-width: 600px)';

describe('useMediaQuery', () => {
  afterEach(jest.resetAllMocks);

  it.each([true, false])(
    'Returns value from window.matchMedia.matches when it is %s',
    (matches) => {
      const matchMediaValue = matchMediaValueMock({ matches });
      const { result } = renderHook(() => useMediaQuery(query));
      expect(matchMediaValue).toHaveBeenCalledWith(query);
      expect(result.current).toBe(matches);
    },
  );

  it('Adds event listener', () => {
    const addEventListener = jest.fn();
    matchMediaValueMock({ addEventListener });
    renderHook(() => useMediaQuery(query));
    expect(addEventListener).toHaveBeenCalledTimes(1);
  });

  it('Removes the event listener on unmount', () => {
    const removeEventListener = jest.fn();
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
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
}>) => {
  const value = jest.fn().mockImplementation((query: string) => ({
    matches: matches ?? false,
    media: query,
    onchange: null,
    addEventListener: addEventListener ?? jest.fn(),
    removeEventListener: removeEventListener ?? jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  Object.defineProperty(window, 'matchMedia', { writable: true, value });
  return value;
};
