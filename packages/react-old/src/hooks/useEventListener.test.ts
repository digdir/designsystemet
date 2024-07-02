import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { vi } from 'vitest';

import { useEventListener } from '.';

const user = userEvent.setup();

const renderUseEventListener = (eventType: string, action: () => void) =>
  renderHook(() => useEventListener(eventType, action, document.body), {
    initialProps: { eventType, action },
  });

describe('useEventListener', () => {
  it('Calls action when given event happens', async () => {
    const action = vi.fn();
    renderUseEventListener('click', action);
    await act(() => user.click(document.body));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('Does not call action when another event is given', async () => {
    const action = vi.fn();
    renderUseEventListener('click', action);
    await act(() => user.keyboard('{Enter}'));
    expect(action).not.toHaveBeenCalled();
  });

  it('Removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(
      document.body,
      'removeEventListener',
    );
    const { unmount } = renderUseEventListener('click', vi.fn());
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });
});
