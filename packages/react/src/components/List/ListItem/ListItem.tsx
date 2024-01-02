import React from 'react';
import type { HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './ListItem.module.css';

export type ListItemProps = HTMLAttributes<HTMLLIElement>;

export const ListItem = ({ children, className, ...rest }: ListItemProps) => (
  <li
    className={cl(classes.listItem, className)}
    {...rest}
  >
    {children}
  </li>
);

ListItem.displayName = 'List.Item';
