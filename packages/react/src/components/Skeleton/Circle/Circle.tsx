import type { HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from '../Skeleton.module.css';
import { useSynchronizedAnimation } from '../../../hooks';

export type CircleProps = {
  /** The width of the component */
  width?: string | number;
  /** The height of the component */
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Circle = ({
  width,
  height,
  className,
  children,
  style,
  ...rest
}: CircleProps) => {
  const ref = useSynchronizedAnimation<HTMLDivElement>(classes['opacity-fade']);

  return (
    <div
      ref={ref}
      className={cl(
        classes.skeleton,
        classes.circle,
        { [classes.hasChildren]: Boolean(children) },
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

Circle.displayName = 'SkeletonCircle';
