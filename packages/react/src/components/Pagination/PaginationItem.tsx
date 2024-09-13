import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useContext } from 'react';

import { PaginationContext } from './PaginationRoot';

export type PaginationItemProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLLIElement>, 'size'>;

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  function PaginationItem({ asChild, className, ...rest }, ref) {
    const Component = asChild ? Slot : 'li';

    const { size, compact } = useContext(PaginationContext);

    return (
      <Component
        ref={ref}
        className={cl(
          'ds-pagination__item',
          `ds-pagination--${size}`,
          compact && 'ds-pagination--compact',
          className,
        )}
        {...rest}
      />
    );
  },
);
