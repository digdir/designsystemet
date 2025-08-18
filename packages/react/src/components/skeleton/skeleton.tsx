import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { forwardRef, type HTMLAttributes } from 'react';
import { useSynchronizedAnimation } from '../../utilities';
import { useMergeRefs } from '../../utilities/hooks';

export type SkeletonProps = {
  /**
   * The width of the component
   */
  width?: string | number;
  /**
   * The height of the component
   */
  height?: string | number;
  /**
   * The shape variant
   * @default 'rectangle'
   */
  variant?: 'rectangle' | 'circle' | 'text';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /** @deprecated This prop has no effect. Use `width` or supply text as children instead */
  characters?: number;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * Skeleton is used to represent a draft of page while the content loads.
 *
 * @example
 * <Skeleton variant="circle" />
 * <Skeleton variant="text" />
 * <Skeleton variant="rectangle" />
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
