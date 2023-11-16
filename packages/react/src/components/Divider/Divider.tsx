import React from 'react';
import cn from 'classnames';

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
      className={cn(
        classes.divider,
        classes[color + 'Divider'],
        rest.className,
      )}
    />
  );
};
