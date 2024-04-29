import { forwardRef } from 'react';
import type { LiHTMLAttributes } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import classes from './List.module.css';

export type ListItemProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & LiHTMLAttributes<HTMLLIElement>;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(({ asChild, className, ...rest }, ref) => {
  const Component = asChild ? Slot : 'li';

  return (
    <Component
      className={cl(classes.listItem, className)}
      {...rest}
      ref={ref}
    />
  );
});

ListItem.displayName = 'ListItem';
