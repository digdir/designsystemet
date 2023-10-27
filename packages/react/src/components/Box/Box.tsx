import React, { HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './Box.module.css';

export type BoxProps = {
  /**
   * Shadow size of the box
   * @default medium
   */
  shadow?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * Padding size of the box
   * @default medium
   */
  padding?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
} & HTMLAttributes<HTMLDivElement>;

export const Box = ({
  shadow = 'medium',
  padding = 'medium',
  children,
  ...rest
}: BoxProps) => {
  return (
    <div
      className={cn(
        classes.box,
        classes[shadow + 'Shadow'],
        classes[padding + 'Padding'],
        rest.className,
      )}
    >
      {children}
    </div>
  );
};
