import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext, type HTMLAttributes } from 'react';
import cl from 'clsx';

import { PaginationContext } from './PaginationRoot';
import classes from './Pagination.module.css';

export type PaginationItemProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLLIElement>, 'size'>;

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(({ asChild, className, ...rest }, ref) => {
  const Component = asChild ? Slot : 'li';

  const { size, compact } = useContext(PaginationContext);

  return (
    <Component
      ref={ref}
      className={cl(classes.listitem, classes[size], compact && classes.compact, className)}
      {...rest}
    />
  );
});

export default PaginationItem;
