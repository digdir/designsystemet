// Based on https://github.com/juliencrn/usehooks-ts/blob/master/packages/usehooks-ts/src/useEventListener/useEventListener.test.ts
// MIT License, Copyright (c) 2020 Julien CARON
// Changes: Use `vi`, only support element refs (no window, document or options), and allow StrictMode double effects (enabled in vitest.setup.ts)

import { fireEvent, renderHook } from '@testing-library/react';
import { useEventListener } from './use-event-listener';

declare global {
  interface HTMLElementEventMap {
    'test-event': CustomEvent;
  }
}

const ref = { current: document.createElement('div') };
const addSpy = vi.spyOn(ref.current, 'addEventListener');
const removeSpy = vi.spyOn(ref.current, 'removeEventListener');

describe('useEventListener()', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should bind/unbind the event listener to the element', () => {
    const { unmount } = renderHook(() => {
      useEventListener('test-event', vi.fn(), ref);
    });

    expect(addSpy).toHaveBeenCalledWith('test-event', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('test-event', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledTimes(addSpy.mock.calls.length);
  });

  it('should do nothing when the ref is empty', () => {
    const handler = vi.fn();
    const emptyRef = { current: null };

    const { unmount } = renderHook(() => {
      useEventListener('click', handler, emptyRef);
    });
    unmount();

    expect(handler).not.toHaveBeenCalled();
  });

  it('should call the event listener handler when the event is triggered', () => {
    const handler = vi.fn();

    renderHook(() => {
      useEventListener('click', handler, ref);
    });

    fireEvent.click(ref.current);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should call the latest handler without rebinding', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = renderHook(
      ({ handler }) => {
        useEventListener('click', handler, ref);
      },
      { initialProps: { handler: first } },
    );
    const bindings = addSpy.mock.calls.length;

    rerender({ handler: second });
    fireEvent.click(ref.current);

    expect(addSpy).toHaveBeenCalledTimes(bindings);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('should not call a handler that is set to undefined', () => {
    const handler = vi.fn();

    const { rerender } = renderHook(
      ({ handler }) => {
        useEventListener('click', handler, ref);
      },
      { initialProps: { handler: handler as (() => void) | undefined } },
    );

    rerender({ handler: undefined });
    fireEvent.click(ref.current);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should have the correct event type', () => {
    const clickHandler = vi.fn();
    const keydownHandler = vi.fn();

    renderHook(() => {
      useEventListener('click', clickHandler, ref);
    });
    renderHook(() => {
      useEventListener('keydown', keydownHandler, ref);
    });

    fireEvent.click(ref.current);
    fireEvent.keyDown(ref.current);

    expect(clickHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(keydownHandler).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });
});
