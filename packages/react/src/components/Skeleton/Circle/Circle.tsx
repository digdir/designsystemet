import React, { type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Skeleton.module.css';
import { useSynchronizedAnimation } from '../../../hooks';

export type CircleProps = {
  width?: string | number;
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
  const ref = useSynchronizedAnimation('opacity-fade');

  return (
    <div
      ref={ref}
      className={cn(
        classes.skeleton,
        classes.circle,
        { [classes.hasChildren]: Boolean(children) },
        className,
      )}
      style={{ width, height }}
      aria-hidden
      {...rest}
    >
      {children}
    </div>
  );
};
