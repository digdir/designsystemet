import { useEffect } from 'react';

type Element = HTMLElement | null | undefined;

/**
 * Adds a keyboard event listener to the given element. The listener is removed on unmount.
 * @param key The keyboard key to listen for.
 * @param onKeyDown The action to perform when the key is pressed. Accepts the KeyboardEvent as a parameter.
 * @param element The element to add the event listener to. No event listener is added if no element is given.
 */
export function useKeyboardEventListener<T extends Element>(
  key: string,
  onKeyDown: () => void,
  element?: T,
) {
  useEffect(() => {
    if (!element) return;
    const keyDownEvent = (event: KeyboardEvent) => {
      if (event.key === key) onKeyDown();
    };
    element.addEventListener('keydown', keyDownEvent);
    return () => element.removeEventListener('keydown', keyDownEvent);
  }, [key, onKeyDown, element]);
}
