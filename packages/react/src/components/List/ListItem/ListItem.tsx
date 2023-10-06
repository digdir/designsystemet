import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';

import classes from './ListItem.module.css';

export type ListItemProps = ComponentPropsWithoutRef<'li'>;

export const ListItem = ({ children, ...rest }: ListItemProps) => (
  <li
    {...rest}
    className={classes.listItem}
  >
    {children}
  </li>
);
