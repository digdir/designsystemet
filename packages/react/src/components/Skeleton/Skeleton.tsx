import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

import { useSynchronizedAnimation } from '../../utilities';

export type SkeletonProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /** The width of the component */
  width?: string | number;
  /** The height of the component */
  height?: string | number;
  /**
   * The shape variant
   * @default 'rectangle'
   * */
  variant?: 'rectangle' | 'circle' | 'text';
} & HTMLAttributes<HTMLSpanElement> &
  (
    | { variant: 'text'; characters?: number }
    | { variant?: 'rectangle' | 'circle'; characters?: never }
  );

/**
 * Represent a draft of page while the content loads. Mix different skeleton components to create your layout.
 * @example
 *   <Skeleton variant="circle" />
 *   <Skeleton variant="text" />
 *   <Skeleton variant="rectangle" />
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  function Skeleton(
    {
      asChild,
      className,
      height,
      style,
      variant = 'rectangle',
      width,
      ...rest
    },
    ref,
  ) {
    const Component = asChild ? Slot : 'span';
    const isText = variant === 'text';
    const animationRef = useSynchronizedAnimation<HTMLSpanElement>(
      'ds-skeleton-opacity-fade',
    );
    const mergedRefs = useMergeRefs([animationRef, ref]);

    return (
      <Component
        aria-hidden='true'
        className={cl('ds-skeleton', className)}
        data-text={isText ? '-'.repeat(Number(width) || 1) : undefined}
        data-variant={variant}
        ref={mergedRefs}
        style={isText ? style : { width, height, ...style }}
        {...rest}
      />
    );
  },
);
