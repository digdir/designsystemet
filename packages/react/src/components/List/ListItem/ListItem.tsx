import React from 'react';
import type { HTMLAttributes } from 'react';

export type ListItemProps = HTMLAttributes<HTMLLIElement>;

export const ListItem = ({ children, ...rest }: ListItemProps) => (
  <li {...rest}>{children}</li>
);

ListItem.displayName = 'List.Item';
