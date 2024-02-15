import type * as React from 'react';
import cl from 'clsx';
import { forwardRef } from 'react';

import classes from './Divider.module.css';

export type DividerProps = {
  /**
   * The color of the divider.
   * @default 'default'
   */
  color?: 'default' | 'strong' | 'subtle';
} & React.HTMLAttributes<HTMLHRElement>;

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ color = 'default', className, ...rest }, ref) => {
    return (
      <hr
        className={cl(classes.divider, classes[color], className)}
        ref={ref}
        {...rest}
      />
    );
  },
);

Divider.displayName = 'Divider';

Divider.displayName = 'Divider';
