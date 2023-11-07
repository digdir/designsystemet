import React from 'react';
import cn from 'classnames';

import classes from './Divider.module.css';

export type DividerProps = {
  /**
   * The color of the divider.
   * @default 'default'
   */
  color: 'default' | 'strong' | 'subtle';
};

export const Divider = ({ color = 'default' }: DividerProps) => {
  return <hr className={cn(classes.divider, classes[color + 'Divider'])} />;
};
