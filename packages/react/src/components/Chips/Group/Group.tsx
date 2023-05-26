import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Group.module.css';

export type ChipGroupProps = {
  /**
   * Changes padding and font-sizes.
   */
  size?: 'xsmall' | 'small';
} & React.HTMLAttributes<HTMLUListElement>;

export const ChipGroup = forwardRef<HTMLUListElement, ChipGroupProps>(
  ({ className, size = 'small', children, ...rest }, ref) => (
    <ul
      {...rest}
      ref={ref}
      className={cn(className, classes.chips, classes[size])}
    >
      {children}
    </ul>
  ),
);
