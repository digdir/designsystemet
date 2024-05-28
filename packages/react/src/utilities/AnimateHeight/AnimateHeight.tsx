import { useCallback, useRef, useState } from 'react';
import type * as React from 'react';
import cl from 'clsx/lite';

import { useMediaQuery, usePrevious } from '../../hooks';

export type AnimateHeightProps = {
  open: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

type InternalState = 'open' | 'closed' | 'openingOrClosing';

const transitionDurationInMilliseconds = 250;

/**
 * AnimateHeight is a component that animates its height when the `open` prop changes.
 */
export const AnimateHeight = ({
  children,
  className,
  open = false,
  style,
  ...rest
}: AnimateHeightProps) => {
  const [height, setHeight] = useState<number>(0);
  const prevOpen = usePrevious(open);
  const openOrClosed: InternalState = open ? 'open' : 'closed';
  const [state, setState] = useState<InternalState>(openOrClosed);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldAnimate = !useMediaQuery('(prefers-reduced-motion)');

  const contentRef = useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        const resizeObserver = new ResizeObserver(() => {
          setHeight(open ? node.getBoundingClientRect().height : 0);
        });
        resizeObserver.observe(node);
      }
      if (prevOpen !== undefined && prevOpen !== open) {
        // Opening or closing
        setState(shouldAnimate ? 'openingOrClosing' : openOrClosed);
        timeoutRef.current && clearTimeout(timeoutRef.current); // Reset timeout if already active (i.e. if the user closes the component before it finishes opening)
        timeoutRef.current = setTimeout(() => {
          setState(openOrClosed);
        }, transitionDurationInMilliseconds);
      }
    },
    [open, openOrClosed, prevOpen, shouldAnimate],
  );

  const transition =
    state === 'openingOrClosing'
      ? `height ${transitionDurationInMilliseconds}ms ease-in-out`
      : undefined;

  return (
    <div
      {...rest}
      className={cl(
        'fds-animate-height',
        `fds-animate-height--${state}`,
        className,
      )}
      style={{ height, transition, ...style }}
    >
      <div
        ref={contentRef}
        className='fds-animate-height__content'
      >
        {children}
      </div>
    </div>
  );
};
