// from https://usehooks-ts.com/react-hook/use-media-query

import { useEffect, useLayoutEffect, useState } from 'react';

// https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === 'undefined';

/**
 * Custom React hook that evaluates a CSS media query and returns a boolean indicating if it matches.
 *
 * This hook listens for changes to the media query and updates the returned value accordingly.
 * It supports server-side rendering by allowing a default value and can initialize with the current value or a default.
 *
 * @param query - The CSS media query string to evaluate (e.g., '(min-width: 768px)').
 * @param options - Optional configuration object.
 * @param options.defaultValue - The value to return on the server or before the media query is evaluated. Defaults to `false`.
 * @param options.initializeWithValue - Whether to initialize with the current media query value on mount. Defaults to `true`.
 * @returns A boolean indicating whether the media query currently matches.
 *
 * @example
 * ```tsx
 * const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 * ```
 */
export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  // Handles the change event of the media query.
  function handleChange() {
    setMatches(getMatches(query));
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Use deprecated `addListener` and `removeListener` to support Safari < 14 (#135)
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return matches;
}
