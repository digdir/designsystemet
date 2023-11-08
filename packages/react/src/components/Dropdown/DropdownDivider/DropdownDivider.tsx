import React from 'react';
import cn from 'classnames';

import { Divider } from '../../Divider';

import classes from './DropdownDivider.module.css';

export type DropdownDividerProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownDivider = ({ ...rest }: DropdownDividerProps) => {
  return (
    <Divider
      {...rest}
      className={cn(classes.divider, rest.className)}
      color='default'
    />
  );
};

DropdownDivider.displayName = 'Dropdown.Divider';
