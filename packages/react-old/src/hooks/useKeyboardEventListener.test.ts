import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { useKeyboardEventListener } from '.';

const user = userEvent.setup();

const renderUseKeyboardEventListener = (key: string, onKeyDown: () => void) =>
  renderHook(() => useKeyboardEventListener(key, onKeyDown, document.body), {
    initialProps: { key, onKeyDown },
  });

describe('useKeyboardEventListener', () => {
  it('Calls onKeyDown when given key is pressed', async () => {
    const onKeyDown = jest.fn();
    renderUseKeyboardEventListener('Enter', onKeyDown);
    await act(() => user.keyboard('{Enter}'));
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('Does not call onKeyDown when another key is pressed', async () => {
    const onKeyDown = jest.fn();
    renderUseKeyboardEventListener('ArrowUp', onKeyDown);
    await act(() => user.keyboard('{Enter}'));
    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it('Removes event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(
      document.body,
      'removeEventListener',
    );
    const { unmount } = renderUseKeyboardEventListener('Enter', jest.fn());
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });
});
