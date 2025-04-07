// https://github.com/floating-ui/floating-ui/blob/master/packages/react/src/hooks/useMergeRefs.ts
import * as React from 'react';

/**
 * Merges an array of refs into a single memoized callback ref or `null`.
 * @see https://floating-ui.com/docs/react-utils#usemergerefs
 */
export function useMergeRefs<Instance>(
  refs: Array<React.Ref<Instance> | undefined>,
): null | React.RefCallback<Instance> {
  const cleanupRef = React.useRef<undefined | (() => void)>(undefined);

  const refEffect = React.useCallback((instance: Instance | null) => {
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

      (ref as React.RefObject<Instance | null>).current = instance;
      return () => {
        (ref as React.RefObject<Instance | null>).current = null;
      };
    });

    return () => {
      for (const refCleanup of cleanups) {
        refCleanup?.();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);

  return React.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (value) => {
      if (cleanupRef.current) {
        cleanupRef.current();
        (cleanupRef as React.RefObject<undefined | (() => void)>).current =
          undefined;
      }

      if (value != null) {
        (cleanupRef as React.RefObject<undefined | (() => void)>).current =
          refEffect(value);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
