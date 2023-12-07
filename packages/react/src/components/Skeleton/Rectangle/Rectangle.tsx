import React, { type HTMLAttributes } from 'react';
import cn from 'classnames';

import { useSynchronizedAnimation } from '../../../hooks';
import classes from '../Skeleton.module.css';

export type RectangleProps = {
  width?: string | number;
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Rectangle = ({
  width,
  height,
  className,
  children,
  ...rest
}: RectangleProps) => {
  const ref = useSynchronizedAnimation('opacity-fade');

  return (
    <div
      ref={ref}
      className={cn(classes.skeleton, classes.rectangle, className, {
        [classes.hasChildren]: Boolean(children),
      })}
      style={{ width, height }}
      aria-hidden
      {...rest}
    >
      {children}
    </div>
  );
};
