import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext, type HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './Pagination.module.css';
import { PaginationContext } from './PaginationRoot';

export type PaginationContentProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

export const PaginationContent = forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'ul';

    const { size } = useContext(PaginationContext);

    return (
      <Component
        ref={ref}
        className={cl(classes.pagination, classes[size], className)}
        {...rest}
      />
    );
  },
);
