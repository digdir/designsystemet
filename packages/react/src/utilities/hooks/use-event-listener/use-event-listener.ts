import { useEffect, useInsertionEffect, useRef } from 'react';

/**
 * Adds an event listener to the element in `ref`, always calling the latest `handler`.
 */
export function useEventListener<
  Type extends keyof HTMLElementEventMap,
  Evt extends HTMLElementEventMap[Type] = HTMLElementEventMap[Type],
>(
  type: Type,
  handler: ((event: Evt) => void) | undefined,
  ref: React.RefObject<HTMLElement | null>,
) {
  const handlerRef = useRef(handler);

  // useInsertionEffect runs before all other effects and never on the server, so the
  // listener always calls the latest handler (same approach as polyfills of React's useEffectEvent)
  useInsertionEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = (event: HTMLElementEventMap[Type]) =>
      handlerRef.current?.(event as Evt);
    el.addEventListener(type, fn);
    return () => el.removeEventListener(type, fn);
  }, [type, ref]);
}
