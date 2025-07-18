// Inspired by Sam Selikoff
// https://github.com/samselikoff/2022-02-24-use-synchronized-animation/blob/main/src/App.js

import { useEffect, useLayoutEffect, useRef } from 'react';

// https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Synchronizes the css animation of multiple elements with the same `animationName`.
 *
 * @example
 * ```tsx
 *  const ref = useSynchronizedAnimation<HTMLDivElement>('spin');
 *
 *  <div
 *   ref={ref}
 *  />
 * ```
 */
export function useSynchronizedAnimation<T>(animationName: string) {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const animations = document
      .getAnimations()
      .filter(
        (animation) =>
          'animationName' in animation &&
          animation.animationName === animationName,
      );

    const firstOfType = animations.find(
      (animation) =>
        'animationName' in animation &&
        animation.animationName === animationName,
    );

    const myAnimation = animations.find(
      (animation) =>
        (animation.effect as KeyframeEffect)?.target === ref.current,
    );

    if (myAnimation && myAnimation === firstOfType) {
      myAnimation.currentTime = 0;
    }

    if (
      myAnimation &&
      firstOfType?.currentTime &&
      myAnimation !== firstOfType
    ) {
      myAnimation.currentTime = firstOfType.currentTime;
    }

    return () => {
      if (myAnimation && firstOfType?.currentTime) {
        myAnimation.currentTime = firstOfType.currentTime;
      }
    };
  }, [animationName]);

  return ref;
}
