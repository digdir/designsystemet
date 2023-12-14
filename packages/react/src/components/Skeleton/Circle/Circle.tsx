import React, { type HTMLAttributes } from 'react';
import cn from 'classnames';

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
  ...rest
}: CircleProps) => {
  const ref = useSynchronizedAnimation<HTMLDivElement>('opacity-fade');

  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        classes.skeleton,
        classes.circle,
        { [classes.hasChildren]: Boolean(children) },
        className,
      )}
      style={{ width, height, ...rest.style }}
      aria-hidden
    >
      {children}
    </div>
  );
};
