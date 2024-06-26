import { renderHook } from '@testing-library/react';

import { usePrevious } from './';

const renderUsePrevious = () =>
  renderHook(({ state }) => usePrevious(state), { initialProps: { state: 0 } });

describe('usePrevious', () => {
  it('Returns undefined on initial render', () => {
    const { result } = renderUsePrevious();
    expect(result.current).toBeUndefined();
  });

  it('Returns previous state after rerender', () => {
    const { result, rerender } = renderUsePrevious();
    rerender({ state: 1 });
    expect(result.current).toBe(0);
    rerender({ state: 2 });
    expect(result.current).toBe(1);
    rerender({ state: 4 });
    expect(result.current).toBe(2);
    rerender({ state: 8 });
    expect(result.current).toBe(4);
  });
});
