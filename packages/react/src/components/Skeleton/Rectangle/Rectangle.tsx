import type { HTMLAttributes } from 'react';
import cl from 'clsx';

import { useSynchronizedAnimation } from '../../../hooks';
import classes from '../Skeleton.module.css';

export type RectangleProps = {
  /** The width of the component */
  width?: string | number;
  /** The height of the component */
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of rectangle shape */
export const Rectangle = ({ width, height, className, children, style, ...rest }: RectangleProps) => {
  const ref = useSynchronizedAnimation<HTMLDivElement>(classes['opacity-fade']);

  return (
    <div
      ref={ref}
      className={cl(
        classes.skeleton,
        classes.rectangle,
        {
          [classes.hasChildren]: Boolean(children),
        },
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
