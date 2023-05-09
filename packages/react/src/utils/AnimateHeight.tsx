/* https://github.com/Stanko/react-animate-height/blob/v3/src/index.tsx */
import type { CSSProperties } from 'react';
import React, { useEffect, useRef, useState } from 'react';

// ------------------ Types

export type Height = 'auto' | number | `${number}%`;
type Timeout = ReturnType<typeof setTimeout>;
type Overflow = 'auto' | 'visible' | 'hidden' | undefined;

// ------------------ Helpers

function isNumber(n: string) {
  const number = parseFloat(n);
  return !isNaN(number) && isFinite(number);
}

function isPercentage(height: Height) {
  // Percentage height
  return (
    typeof height === 'string' &&
    height[height.length - 1] === '%' &&
    isNumber(height.substring(0, height.length - 1))
  );
}

function hideContent(element: HTMLDivElement | null, height: Height) {
  // Check for element?.style is added cause this would fail in tests (react-test-renderer)
  // Read more here: https://github.com/Stanko/react-animate-height/issues/17
  if (height === 0 && element?.style) {
    element.style.display = 'none';
  }
}

function showContent(element: HTMLDivElement | null, height: Height) {
  // Check for element?.style is added cause this would fail in tests (react-test-renderer)
  // Read more here: https://github.com/Stanko/react-animate-height/issues/17
  if (height === 0 && element?.style) {
    element.style.display = '';
  }
}

// ------------------ Component

interface AnimateHeightProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * @default 250ms
   */
  duration?: number;
  /**
   * @default ease
   */
  easing?: string;
  height: Height;
  innerClassName?: string;
}

const AnimateHeight: React.FC<AnimateHeightProps> = ({
  children,
  className,
  innerClassName,
  duration: userDuration = 250,
  easing = 'ease',
  height,
  ...props
}) => {
  // ------------------ Initialization
  const prevHeight = useRef<Height>(height);
  const contentElement = useRef<HTMLDivElement>(null);

  const animationClassesTimeoutID = useRef<Timeout>();
  const timeoutID = useRef<Timeout>();

  const isBrowser = typeof window !== 'undefined';

  const prefersReducedMotion = useRef<boolean>(
    isBrowser && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion)').matches
      : false,
  );

  const duration = prefersReducedMotion.current ? 0 : userDuration;

  let initHeight: Height = height;
  let initOverflow: Overflow = 'visible';

  if (typeof initHeight === 'number') {
    // Reset negative height to 0
    initHeight = +height < 0 ? 0 : height;
    initOverflow = 'hidden';
  } else if (isPercentage(initHeight)) {
    // If value is string "0%" make sure we convert it to number 0
    initHeight = height === '0%' ? 0 : height;
    initOverflow = 'hidden';
  }

  const [currentHeight, setCurrentHeight] = useState<Height>(initHeight);
  const [overflow, setOverflow] = useState<Overflow>(initOverflow);
  const [useTransitions, setUseTransitions] = useState<boolean>(false);

  // ------------------ Did mount
  useEffect(() => {
    // Hide content if height is 0 (to prevent tabbing into it)
    hideContent(contentElement.current, currentHeight);

    // This should be explicitly run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------ Height update
  useEffect(() => {
    if (height !== prevHeight.current && contentElement.current) {
      showContent(contentElement.current, prevHeight.current);

      // Cache content height
      contentElement.current.style.overflow = 'hidden';
      const contentHeight = contentElement.current.offsetHeight;
      contentElement.current.style.overflow = '';

      // set total animation time
      const totalDuration = duration;

      let newHeight: Height;
      let timeoutHeight: Height;
      let timeoutOverflow: Overflow = 'hidden';
      let timeoutUseTransitions: boolean;

      const isCurrentHeightAuto = prevHeight.current === 'auto';

      if (typeof height === 'number') {
        // Reset negative height to 0
        newHeight = height < 0 ? 0 : height;
        timeoutHeight = newHeight;
      } else if (isPercentage(height)) {
        // If value is string "0%" make sure we convert it to number 0
        newHeight = height === '0%' ? 0 : height;
        timeoutHeight = newHeight;
      } else {
        // If not, animate to content height
        // and then reset to auto
        newHeight = contentHeight; // TODO solve contentHeight = 0
        timeoutHeight = 'auto';
        timeoutOverflow = undefined;
      }

      if (isCurrentHeightAuto) {
        // This is the height to be animated to
        timeoutHeight = newHeight;

        // If previous height was 'auto'
        // set starting height explicitly to be able to use transition
        newHeight = contentHeight;
      }

      // Set starting height and animating classes
      // When animating from 'auto' we first need to set fixed height
      // that change should be animated
      setCurrentHeight(newHeight);
      setOverflow('hidden');
      setUseTransitions(!isCurrentHeightAuto);

      // Clear timeouts
      clearTimeout(timeoutID.current as Timeout);
      clearTimeout(animationClassesTimeoutID.current as Timeout);

      if (isCurrentHeightAuto) {
        // When animating from 'auto' we use a short timeout to start animation
        // after setting fixed height above
        timeoutUseTransitions = true;

        // Short timeout to allow rendering of the initial animation state first
        timeoutID.current = setTimeout(() => {
          setCurrentHeight(timeoutHeight);
          setOverflow(timeoutOverflow);
          setUseTransitions(timeoutUseTransitions);
        }, 50);

        // Set static classes and remove transitions when animation ends
        animationClassesTimeoutID.current = setTimeout(() => {
          setUseTransitions(false);

          // ANIMATION ENDS
          // Hide content if height is 0 (to prevent tabbing into it)
          hideContent(contentElement.current, timeoutHeight);
        }, totalDuration);
      } else {
        // Set end height, classes and remove transitions when animation is complete
        timeoutID.current = setTimeout(() => {
          setCurrentHeight(timeoutHeight);
          setOverflow(timeoutOverflow);
          setUseTransitions(false);

          // ANIMATION ENDS
          // If height is auto, don't hide the content
          // (case when element is empty, therefore height is 0)
          if (height !== 'auto') {
            // Hide content if height is 0 (to prevent tabbing into it)
            hideContent(contentElement.current, newHeight); // TODO solve newHeight = 0
          }
        }, totalDuration);
      }
    }

    prevHeight.current = height;

    return () => {
      clearTimeout(timeoutID.current as Timeout);
      clearTimeout(animationClassesTimeoutID.current as Timeout);
    };

    // This should be explicitly run only on height change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // ------------------ Render

  const componentStyle: CSSProperties = {
    height: currentHeight,
    overflow: overflow,
  };

  if (useTransitions) {
    componentStyle.transition = `height ${duration}ms ${easing} 0ms`;

    // Add webkit vendor prefix still used by opera, blackberry...
    componentStyle.WebkitTransition = componentStyle.transition;
  }

  // Check if user passed aria-hidden prop
  const hasAriaHiddenProp = typeof props['aria-hidden'] !== 'undefined';
  const ariaHidden = hasAriaHiddenProp ? props['aria-hidden'] : height === 0;

  return (
    <div
      {...props}
      className={className}
      style={componentStyle}
    >
      <div
        aria-hidden={ariaHidden}
        className={innerClassName}
        ref={contentElement}
      >
        {children}
      </div>
    </div>
  );
};

export default AnimateHeight;
