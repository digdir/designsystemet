import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import skeletonClasses from '../Skeleton.module.css';

import rectangleClasses from './Rectangle.module.css';

export type RectangleProps = {
  width?: string | number;
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Rectangle = forwardRef<HTMLDivElement, RectangleProps>(
  ({ width, height, className, ...rest }: RectangleProps, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          skeletonClasses.skeleton,
          rectangleClasses.rectangle,
          className,
        )}
        style={{ width, height }}
        {...rest}
      ></div>
    );
  },
);
