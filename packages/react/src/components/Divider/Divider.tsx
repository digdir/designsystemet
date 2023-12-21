import React from 'react';
import cl from 'clsx';

import classes from './Divider.module.css';

export type DividerProps = {
  /**
   * The color of the divider.
   * @default 'default'
   */
  color?: 'default' | 'strong' | 'subtle';
} & React.HTMLAttributes<HTMLHRElement>;

export const Divider = ({ color = 'default', ...rest }: DividerProps) => {
  return (
    <hr
      {...rest}
      className={cl(classes.divider, classes[color], rest.className)}
    />
  );
};
