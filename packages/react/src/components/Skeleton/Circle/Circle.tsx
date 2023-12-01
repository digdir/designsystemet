import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Skeleton.module.css';

export type CircleProps = {
  width?: string | number;
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Circle = forwardRef<HTMLDivElement, CircleProps>(
  ({ width, height, className, children, ...rest }: CircleProps, ref) => {
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
        {...rest}
      >
        {children}
      </div>
    );
  },
);
