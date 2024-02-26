import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

const stashedTime: { [key: string]: CSSNumberish | null } = {};

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

    const myAnimation = animations.find(
      (animation) =>
        (animation.effect as KeyframeEffect)?.target === ref.current,
    );

    if (
      myAnimation &&
      myAnimation === animations[0] &&
      stashedTime[animationName]
    ) {
      myAnimation.currentTime = stashedTime[animationName];
    }

    if (myAnimation && myAnimation !== animations[0]) {
      myAnimation.currentTime = animations[0].currentTime;
    }

    return () => {
      if (myAnimation && myAnimation === animations[0]) {
        stashedTime[animationName] = myAnimation.currentTime;
      }
    };
  }, [animationName]);

  return ref;
}
