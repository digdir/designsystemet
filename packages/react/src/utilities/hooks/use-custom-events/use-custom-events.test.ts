import { renderHook } from '@testing-library/react';
import { useCustomEvents } from './use-custom-events';

const dispatch = (el: HTMLElement, type: string) =>
  el.dispatchEvent(new CustomEvent(type, { detail: el }));

describe('useCustomEvents', () => {
  it('should call the callback when the event is dispatched', () => {
    const ref = { current: document.createElement('div') };
    const callback = vi.fn();
    renderHook(() => useCustomEvents(ref, { comboboxafterselect: callback }));

    dispatch(ref.current, 'comboboxafterselect');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the latest callback after rerender', () => {
    const ref = { current: document.createElement('div') };
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(
      ({ callback }) => useCustomEvents(ref, { comboboxafterselect: callback }),
      { initialProps: { callback: first } },
    );

    rerender({ callback: second });
    dispatch(ref.current, 'comboboxafterselect');
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('should skip undefined callbacks and remove listeners on unmount', () => {
    const ref = { current: document.createElement('div') };
    const callback = vi.fn();
    const { unmount } = renderHook(() =>
      useCustomEvents(ref, {
        comboboxafterselect: callback,
        comboboxbeforeselect: undefined,
      }),
    );

    dispatch(ref.current, 'comboboxbeforeselect');
    unmount();
    dispatch(ref.current, 'comboboxafterselect');
    expect(callback).not.toHaveBeenCalled();
  });
});
