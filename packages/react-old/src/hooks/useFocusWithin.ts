import { useState } from 'react';

import { useEventListener } from './useEventListener';

/**
 * Returns true if the given element is currently focused or contains the currently focused element.
 * @param element The element to check.
 * @returns True if the given element is currently focused or contains the currently focused element.
 */
export function useFocusWithin<T extends HTMLElement>(
  element: T | null,
): boolean {
  const [hasFocus, setHasFocus] = useState<boolean>(false);
  const updateHasFocus = () => {
    const { activeElement } = document;
    setHasFocus(element?.contains(activeElement) ?? false);
  };
  useEventListener('focusin', updateHasFocus, element);
  useEventListener('focusout', updateHasFocus, element);
  return hasFocus;
}
