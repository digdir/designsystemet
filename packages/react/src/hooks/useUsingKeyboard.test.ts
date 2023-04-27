import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { useUsingKeyboard } from './useUsingKeyboard';

const user = userEvent.setup();

describe('useUsingKeyboard', () => {
  it('Returns false by default', () => {
    const { result } = renderHook(() => useUsingKeyboard());
    expect(result.current).toBe(false);
  });

  it('Returns true if a keyboard key has been pressed and false when a mouse button has been clicked', async () => {
    const { result } = renderHook(() => useUsingKeyboard());
    await act(() => user.tab());
    expect(result.current).toBe(true);
    await act(() => user.click(document.body));
    expect(result.current).toBe(false);
    await act(() => user.keyboard('{ArrowDown}'));
    expect(result.current).toBe(true);
  });
});
