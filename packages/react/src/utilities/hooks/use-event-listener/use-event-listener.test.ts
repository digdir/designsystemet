// Inspired by https://github.com/juliencrn/usehooks-ts/blob/master/packages/usehooks-ts/src/useEventListener/useEventListener.test.ts
// MIT License, Copyright (c) 2020 Julien CARON
// Changes: Use `vi`, return a callback ref accepting a map of listeners, and allow StrictMode double effects (enabled in vitest.setup.ts)

import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { createElement } from 'react';
import { type EventListeners, useEventListener } from './use-event-listener';

declare global {
  interface HTMLElementEventMap {
    'test-event': CustomEvent;
  }
}

const setup = (initialProps: EventListeners) =>
  renderHook((listeners: EventListeners) => useEventListener(listeners), {
    initialProps,
  });

describe('useEventListener()', () => {
  it('should bind/unbind the event listeners when the ref is attached/detached', () => {
    const el = document.createElement('div');
    const addSpy = vi.spyOn(el, 'addEventListener');
    const removeSpy = vi.spyOn(el, 'removeEventListener');
    const { result } = setup({ 'test-event': vi.fn(), click: vi.fn() });

    result.current(el);
    expect(addSpy).toHaveBeenCalledWith('test-event', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function));

    result.current(null);
    expect(removeSpy).toHaveBeenCalledWith('test-event', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('should call the matching handler for each event type', () => {
    const el = document.createElement('div');
    const click = vi.fn();
    const keydown = vi.fn();
    const { result } = setup({ click, keydown });

    result.current(el);
    fireEvent.click(el);
    fireEvent.keyDown(el);

    expect(click).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(keydown).toHaveBeenCalledTimes(1);
    expect(keydown).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  it('should call the latest handler without changing the ref', () => {
    const el = document.createElement('div');
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = setup({ click: first });
    const callbackRef = result.current;

    callbackRef(el);
    rerender({ click: second });
    fireEvent.click(el);

    expect(result.current).toBe(callbackRef);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('should not bind handlers that are undefined', () => {
    const el = document.createElement('div');
    const addSpy = vi.spyOn(el, 'addEventListener');
    const { result } = setup({ click: undefined });

    result.current(el);

    expect(addSpy).not.toHaveBeenCalled();
  });

  it('should return a new ref when the set of event types changes', () => {
    const el = document.createElement('div');
    const handler = vi.fn();
    const { result, rerender } = setup({ click: handler });
    const clickRef = result.current;

    clickRef(el);
    rerender({ keydown: handler });
    expect(result.current).not.toBe(clickRef);

    // What React does when the ref changes
    clickRef(null);
    result.current(el);

    fireEvent.click(el);
    fireEvent.keyDown(el);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  it('should follow the element through React renders and unmount', () => {
    const handler = vi.fn();
    const Test = ({ tag }: { tag: 'button' | 'a' | null }) => {
      const listenRef = useEventListener({ click: handler });
      if (tag === null) return null;
      return createElement(tag, { ref: listenRef, 'data-testid': 'target' });
    };

    const { rerender, unmount } = render(
      createElement(Test, { tag: 'button' }),
    );
    const button = screen.getByTestId('target');
    fireEvent.click(button);
    expect(handler).toHaveBeenCalledTimes(1);

    rerender(createElement(Test, { tag: 'a' }));
    const anchor = screen.getByTestId('target');
    fireEvent.click(button);
    fireEvent.click(anchor);
    expect(handler).toHaveBeenCalledTimes(2);

    rerender(createElement(Test, { tag: null }));
    fireEvent.click(anchor);
    expect(handler).toHaveBeenCalledTimes(2);

    rerender(createElement(Test, { tag: 'button' }));
    const removeSpy = vi.spyOn(
      screen.getByTestId('target'),
      'removeEventListener',
    );
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('should move listeners when the element is replaced', () => {
    const first = document.createElement('div');
    const second = document.createElement('div');
    const handler = vi.fn();
    const { result } = setup({ click: handler });

    result.current(first);
    result.current(null);
    result.current(second);
    fireEvent.click(first);
    fireEvent.click(second);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
