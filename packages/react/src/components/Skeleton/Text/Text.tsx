import React, { type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Skeleton.module.css';
import { useSynchronizedAnimation } from '../../../hooks';

export type TextProps = {
  width?: string | number;
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of circular shape */
export const Text = ({
  width,
  height,
  className,
  children,
  ...rest
}: TextProps) => {
  const ref = useSynchronizedAnimation('opacity-fade');

  return (
    <div
      ref={ref}
      className={cn(classes.skeleton, classes.text, className, {
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
