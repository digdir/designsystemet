import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export type PaginationListProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

export const PaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  function PaginationList({ asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'ul';

    return <Component ref={ref} {...rest} />;
  },
);
