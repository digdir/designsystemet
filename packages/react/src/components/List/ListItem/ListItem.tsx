import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

export type ListItemProps = HTMLAttributes<HTMLLIElement>;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, ...rest }: ListItemProps, ref) => (
    <li
      {...rest}
      className={rest.className}
      ref={ref}
    >
      {children}
    </li>
  ),
);

ListItem.displayName = 'List.Item';
