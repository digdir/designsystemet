import { useEffect } from 'react';

type Element = HTMLElement | null | undefined;

/**
 * Adds an event listener to the given element or the document body if no element is given. The listener is removed on unmount.
 * @param eventType The event type to listen for.
 * @param action The action to perform when the event is triggered.
 * @param element The element to add the event listener to. Defaults to the document body.
 */
export function useEventListener<T extends Element>(
  eventType: string,
  action: () => void,
  element?: T,
) {
  useEffect(() => {
    const targetElement = element ?? document.body;
    targetElement.addEventListener(eventType, action);
    return () => targetElement.removeEventListener(eventType, action);
  }, [eventType, action, element]);
}
