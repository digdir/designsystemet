import { forwardRef } from 'react';
import type { LiHTMLAttributes } from 'react';

export type ListItemProps = LiHTMLAttributes<HTMLLIElement>;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  function ListItem(rest, ref) {
    return <li {...rest} ref={ref} />;
  },
);
