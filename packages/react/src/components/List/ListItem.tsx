import React from 'react';
import type { HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './List.module.css';

export type ListItemProps = HTMLAttributes<HTMLLIElement>;

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, className, ...rest }, ref) => (
    <li
      className={cl(classes.listItem, className)}
      ref={ref}
      {...rest}
    >
      {children}
    </li>
  ),
);
