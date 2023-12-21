import React, { type HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from '../Skeleton.module.css';
import { useSynchronizedAnimation } from '../../../hooks';

export type TextProps = {
  /** The width of the component */
  width?: string | number;
  /** The height of the component */
  height?: string | number;
} & HTMLAttributes<HTMLDivElement>;

/**  Skeleton component used for indicating loading elements of text */
export const Text = ({
  width,
  height,
  className,
  children,
  ...rest
}: TextProps) => {
  const ref = useSynchronizedAnimation<HTMLDivElement>(classes['opacity-fade']);

  return (
    <div
      {...rest}
      ref={ref}
      className={cl(
        classes.skeleton,
        classes.text,
        {
          [classes.hasChildren]: Boolean(children),
        },
        className,
      )}
      style={{ width, height, ...rest.style }}
      aria-hidden
    >
      {children}
    </div>
  );
};
