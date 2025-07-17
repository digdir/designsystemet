import { useEffect, useRef } from 'react';

type DebounceFunction<T> = (...args: T[]) => void;

/**
 * Returns a debounced version of the provided callback function.
 * The debounced function delays invoking the callback until after the specified delay
 * has elapsed since the last time the debounced function was called.
 *
 * @template T - The argument types for the callback function.
 * @param callback - The function to debounce.
 * @param delay - The number of milliseconds to delay; defaults to 50ms.
 * @returns A debounced callback function.
 *
 * @remarks
 * The debounced function will cancel any pending invocation if called again before the delay.
 * The timeout is automatically cleared on component unmount.
 */
export function useDebounceCallback<T>(
  callback: DebounceFunction<T>,
  delay = 50,
) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup the previous timeout on re-render
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = (...args: T[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
}
