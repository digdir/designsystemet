import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import skeletonClasses from '../Skeleton.module.css';

import circleClasses from './Circle.module.css';

export type CircleProps = {
  width?: string | number;
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Circle = forwardRef<HTMLDivElement, CircleProps>(
  ({ width, height, className, ...rest }: CircleProps, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          skeletonClasses.skeleton,
          circleClasses.circle,
          className,
        )}
        style={{ width, height }}
        {...rest}
      ></div>
    );
  },
);
