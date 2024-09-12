import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { LiHTMLAttributes } from 'react';

export type ListItemProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & LiHTMLAttributes<HTMLLIElement>;

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  function ListItem({ asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'li';

    return <Component {...rest} ref={ref} />;
  },
);
