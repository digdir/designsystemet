import { useRef, useLayoutEffect } from 'react';

let stashedTime: CSSNumberish | null;

export function useSynchronizedAnimation(animationName: string) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const animations = document
      .getAnimations()
      .filter(
        (animation) =>
          animation[animationName as keyof Animation] === animationName,
      );

    const myAnimation = animations.find(
      (animation) =>
        (animation.effect as KeyframeEffect)?.target === ref.current,
    );

    if (myAnimation && myAnimation === animations[0] && stashedTime) {
      myAnimation.currentTime = stashedTime;
    }

    if (myAnimation && myAnimation !== animations[0]) {
      myAnimation.currentTime = animations[0].currentTime;
    }

    return () => {
      if (myAnimation && myAnimation === animations[0]) {
        stashedTime = myAnimation.currentTime;
      }
    };
  }, [animationName]);

  return ref;
}
