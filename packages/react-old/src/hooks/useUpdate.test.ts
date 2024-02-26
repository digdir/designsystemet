import { renderHook } from '@testing-library/react';

import { useUpdate } from '.';

describe('useUpdate', () => {
  it('Does not call effect on first render', () => {
    const effect = jest.fn();
    renderHook(() => useUpdate(effect, []));
    expect(effect).not.toHaveBeenCalled();
  });

  it('Calls effect on second render if a dependency changes', () => {
    const effect = jest.fn();
    let dependency = 'Something';
    const { rerender } = renderHook(() => useUpdate(effect, [dependency]));
    dependency = 'Something else';
    rerender();
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('Does not call effect on second render if there is no dependency change', () => {
    const effect = jest.fn();
    renderHook(() => useUpdate(effect, [])).rerender();
    expect(effect).not.toHaveBeenCalled();
  });
});
