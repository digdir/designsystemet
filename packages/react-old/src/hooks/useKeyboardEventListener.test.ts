import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { vi } from 'vitest';

import { useKeyboardEventListener } from '.';

const user = userEvent.setup();

const renderUseKeyboardEventListener = (key: string, onKeyDown: () => void) =>
  renderHook(() => useKeyboardEventListener(key, onKeyDown, document.body), {
    initialProps: { key, onKeyDown },
  });

describe('useKeyboardEventListener', () => {
  it('Calls onKeyDown when given key is pressed', async () => {
    const onKeyDown = vi.fn();
    renderUseKeyboardEventListener('Enter', onKeyDown);
    await act(() => user.keyboard('{Enter}'));
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('Does not call onKeyDown when another key is pressed', async () => {
    const onKeyDown = vi.fn();
    renderUseKeyboardEventListener('ArrowUp', onKeyDown);
    await act(() => user.keyboard('{Enter}'));
    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it('Removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(
      document.body,
      'removeEventListener',
    );
    const { unmount } = renderUseKeyboardEventListener('Enter', vi.fn());
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });
});
