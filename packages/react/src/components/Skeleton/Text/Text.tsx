import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Skeleton.module.css';

export type TextProps = {
  width?: string | number;
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Text = forwardRef<HTMLDivElement, TextProps>(
  ({ width, height, className, children, ...rest }: TextProps, ref) => {
    return (
      <div
        ref={ref}
        className={cn(classes.skeleton, classes.text, className, {
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
