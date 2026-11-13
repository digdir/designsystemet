import { useEffect, useRef } from 'react';

type DebounceFunction<T> = (...args: T[]) => void;

// @deprecated v2
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
