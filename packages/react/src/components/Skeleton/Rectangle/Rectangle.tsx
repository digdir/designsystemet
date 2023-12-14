import React, { type HTMLAttributes } from 'react';
import cn from 'classnames';

import { useSynchronizedAnimation } from '../../../hooks';
import classes from '../Skeleton.module.css';

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
  ...rest
}: RectangleProps) => {
  const ref = useSynchronizedAnimation<HTMLDivElement>('opacity-fade');

  return (
    <div
      {...rest}
      ref={ref}
      className={cn(classes.skeleton, classes.rectangle, className, {
        [classes.hasChildren]: Boolean(children),
      })}
      style={{ width, height, ...rest.style }}
      aria-hidden
    >
      {children}
    </div>
  );
};
