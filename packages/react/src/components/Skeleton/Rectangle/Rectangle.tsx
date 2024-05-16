import type { HTMLAttributes } from 'react';
import cl from 'clsx';

import { useSynchronizedAnimation } from '../../../hooks';

export type RectangleProps = {
  /** The width of the component */
  width?: string | number;
  /** The height of the component */
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of rectangle shape */
export const Rectangle = ({
  width,
  height,
  className,
  children,
  style,
  ...rest
}: RectangleProps) => {
  const ref = useSynchronizedAnimation<HTMLDivElement>(
    'fds-skeleton-opacity-fade',
  );

  return (
    <div
      ref={ref}
      className={cl(
        'fds-skeleton',
        'fds-skeleton--rectangle',
        Boolean(children) && 'fds-skeleton--has-children',
        className,
      )}
      style={{ width, height, ...style }}
      aria-hidden
      {...rest}
    >
      {children}
    </div>
  );
};

Rectangle.displayName = 'SkeletonRectangle';
