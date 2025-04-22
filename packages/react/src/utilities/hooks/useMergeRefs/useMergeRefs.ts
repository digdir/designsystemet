// https://github.com/floating-ui/floating-ui/blob/master/packages/react/src/hooks/useMergeRefs.ts
import { useCallback, useMemo, useRef } from 'react';
import type { Ref, RefCallback, RefObject } from 'react';
/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 */
export function useMergeRefs<Instance>(
  refs: Array<Ref<Instance> | undefined>,
): null | RefCallback<Instance> {
  const cleanupRef = useRef<undefined | (() => void)>(undefined);

  const refEffect = useCallback((instance: Instance | null) => {
    const cleanups = refs.map((ref) => {
      if (ref == null) {
        return;
      }

      if (typeof ref === 'function') {
        const refCallback = ref;
        // biome-ignore lint/suspicious/noConfusingVoidType: @types-react wants `void` here
        const refCleanup: void | (() => void) = refCallback(instance);
        return typeof refCleanup === 'function'
          ? refCleanup
          : () => {
              refCallback(null);
            };
      }

      (ref as RefObject<Instance | null>).current = instance;
      return () => {
        (ref as RefObject<Instance | null>).current = null;
      };
    });

    return () => {
      for (const refCleanup of cleanups) {
        refCleanup?.();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);

  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (value) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        (cleanupRef as RefObject<undefined | (() => void)>).current = undefined;
      }

      if (value != null) {
        (cleanupRef as RefObject<undefined | (() => void)>).current =
          refEffect(value);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
