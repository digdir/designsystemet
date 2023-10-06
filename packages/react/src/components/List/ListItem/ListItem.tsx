import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './ListItem.module.css';

export type ListItemProps = HTMLAttributes<HTMLLIElement>;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, ...rest }: ListItemProps, ref) => (
    <li
      {...rest}
      className={cn(classes.listItem, rest.className)}
      ref={ref}
    >
      {children}
    </li>
  ),
);
