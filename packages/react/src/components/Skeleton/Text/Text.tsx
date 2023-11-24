import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import skeletonClasses from '../Skeleton.module.css';

import textClasses from './Text.module.css';

export type TextProps = {
  width?: string | number;
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Text = forwardRef<HTMLDivElement, TextProps>(
  ({ width, height, className, ...rest }: TextProps, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonClasses.skeleton, textClasses.text, className)}
        style={{ width, height }}
        {...rest}
      ></div>
    );
  },
);
