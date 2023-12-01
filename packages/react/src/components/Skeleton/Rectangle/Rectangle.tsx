import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Skeleton.module.css';

export type RectangleProps = {
  width?: string | number;
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Rectangle = forwardRef<HTMLDivElement, RectangleProps>(
  ({ width, height, className, children, ...rest }: RectangleProps, ref) => {
    return (
      <div
        ref={ref}
        className={cn(classes.skeleton, classes.rectangle, className, {
          [classes.hasChildren]: Boolean(children),
        })}
        style={{ width, height }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
