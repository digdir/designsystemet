import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

type EventType = keyof GlobalEventHandlersEventMap;

export type CustomEventHandlers<T extends EventTarget = EventTarget> = {
  [K in EventType]?:
    | ((event: GlobalEventHandlersEventMap[K] & { currentTarget: T }) => void)
    | undefined;
};

/**
 * Used to support custom events in React 18
 *
 * @param ref Ref to the element to bind listeners on
 * @param handlers Object of event type and callback, i.e. `{ customclick: (event) => {} }`
 */
export function useCustomEvents<T extends EventTarget>(
  ref: RefObject<T | null>,
  handlers: CustomEventHandlers<T>,
) {
  const handlersRef = useRef(handlers);
  const types = Object.keys(handlers).join(' '); // Using string to only rebind when types change

  useEffect(() => {
    handlersRef.current = handlers;
  });
  useEffect(() => {
    if (!ref.current || !types) return;
    const self = ref.current;
    const fn = (e: Event) =>
      (handlersRef.current[e.type as EventType] as (e: Event) => void)?.(e);

    for (const type of types.split(' ')) self.addEventListener(type, fn);
    return () => {
      for (const type of types.split(' ')) self.removeEventListener(type, fn);
    };
  }, [ref, types]);
}
