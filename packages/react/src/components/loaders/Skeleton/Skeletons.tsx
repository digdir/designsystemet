import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type ForwardedRef, type HTMLAttributes, forwardRef } from 'react';

import { useSynchronizedAnimation } from '../../../utilities';

type SkeletonProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /** The width of the component */
  width?: string | number;
  /** The height of the component */
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

const render = (
  type: string,
  { asChild, className, width, height, style, ...rest }: SkeletonProps,
  ref: ForwardedRef<HTMLSpanElement>,
) => {
  const Component = asChild ? Slot : 'span';
  const animationRef = useSynchronizedAnimation<HTMLSpanElement>(
    'ds-skeleton-opacity-fade',
  );
  const mergedRefs = useMergeRefs([animationRef, ref]);

  return (
    <Component
      aria-hidden='true'
      className={cl('ds-skeleton', className)}
      data-type={type}
      ref={mergedRefs}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
};

export type SkeletonCircleProps = SkeletonProps;
export const SkeletonCircle = forwardRef<HTMLSpanElement, SkeletonCircleProps>(
  function SkeletonCircle(props, ref) {
    return render('circle', props, ref);
  },
);

export type SkeletonRectangleProps = SkeletonProps;
export const SkeletonRectangle = forwardRef<
  HTMLSpanElement,
  SkeletonRectangleProps
>(function SkeletonRectangle(props, ref) {
  return render('rectangle', props, ref);
});

export type SkeletonTextProps = SkeletonProps;
export const SkeletonText = forwardRef<HTMLSpanElement, SkeletonTextProps>(
  function SkeletonText(props, ref) {
    return render('text', props, ref);
  },
);
