import { useCallback, useInsertionEffect, useRef, useState } from 'react';

// Method signature makes the parameter bivariant (same trick as @types/react's EventHandler),
// so handlers can narrow the event, e.g. to a more specific `currentTarget`
type Handler<E> = { bivarianceHack(event: E): void }['bivarianceHack'];

export type EventListeners = {
  [Type in keyof HTMLElementEventMap]?: Handler<HTMLElementEventMap[Type]>;
};

/**
 * Adds event listeners to the element the returned callback ref is attached to,
 * always calling the latest handlers. Rebinds when the element or the set of event types changes.
 *
 * @example
 * const listenRef = useEventListener({ click: onClick, keydown: onKeyDown });
 * return <div ref={listenRef} />;
 */
export function useEventListener(listeners: EventListeners) {
  const types = Object.keys(listeners).sort().join(' ');
  const elRef = useRef<HTMLElement>(null);
  const fnRef = useRef(listeners);

  // useInsertionEffect runs before all other effects and never on the server, so the
  // listener always calls the latest handlers (same approach as polyfills of React's useEffectEvent)
  useInsertionEffect(() => {
    fnRef.current = listeners;
  }, [listeners]);

  // Stable listener for the lifetime of the component, so it can always be removed again
  const [fn] = useState(
    () => (e: Event) =>
      (fnRef.current[e.type as keyof EventListeners] as Handler<Event>)?.(e),
  );

  // A new callback ref makes React call the previous one with null and the new one with the element.
  // Not returning a cleanup function, so React 18 and 19 both use the null call to unbind
  return useCallback(
    (el: HTMLElement | null) => {
      const list = types?.split(' ') || [];
      for (const type of list) elRef.current?.removeEventListener(type, fn);
      for (const type of list) el?.addEventListener(type, fn);
      elRef.current = el;
    },
    [types, fn],
  );
}
