import type * as React from 'react';
import cl from 'clsx';

import classes from './Divider.module.css';

export type DividerProps = {
  /**
   * The color of the divider.
   * @default 'default'
   */
  color?: 'default' | 'strong' | 'subtle';
} & React.HTMLAttributes<HTMLHRElement>;

export const Divider = ({
  color = 'default',
  className,
  ...rest
}: DividerProps) => {
  return (
    <hr
      className={cl(classes.divider, classes[color], className)}
      {...rest}
    />
  );
};
