import { useEffect } from 'react';

export function useKeyboardEventListener(key: string, onKeyDown: () => void) {
  useEffect(() => {
    const keyDownEvent = (event: KeyboardEvent) => {
      if (event.key === key) onKeyDown();
    };
    document.addEventListener('keydown', keyDownEvent);
    return () => document.removeEventListener('keydown', keyDownEvent);
  }, [key, onKeyDown]);
}
