import type { RefObject } from 'react';
import { useState } from 'react';

import { useEventListener } from './useEventListener';

/**
 * Returns true if the given ref is currently focused or contains the currently focused element.
 * @param ref Reference to the element to check.
 * @returns True if the given ref is currently focused or contains the currently focused element.
 */
export function useFocusWithin<T extends HTMLElement>(
  ref: RefObject<T>,
): boolean {
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const updateHasFocus = () => {
    const { activeElement } = document;
    setHasFocus(ref.current?.contains(activeElement) ?? false);
  };
  useEventListener('focusin', updateHasFocus, ref.current);
  useEventListener('focusout', updateHasFocus, ref.current);
  return hasFocus;
}
