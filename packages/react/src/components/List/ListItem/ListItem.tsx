import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';

import classes from './ListItem.module.css';

export type ListItemProps = HTMLAttributes<HTMLLIElement>;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
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
