import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

export type ListItemProps = HTMLAttributes<HTMLLIElement>;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ children, ...rest }: ListItemProps, ref) => (
    <li
      {...rest}
      ref={ref}
      className={rest.className}
    >
      {children}
    </li>
  ),
);

ListItem.displayName = 'List.Item';
