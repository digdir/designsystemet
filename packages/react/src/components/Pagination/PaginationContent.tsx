import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useContext } from 'react';

import { PaginationContext } from './PaginationRoot';

export type PaginationContentProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

export const PaginationContent = forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(({ asChild, className, ...rest }, ref) => {
  const Component = asChild ? Slot : 'ul';

  const { size } = useContext(PaginationContext);

  return (
    <Component
      ref={ref}
      className={cl('ds-pagination', `ds-pagination--${size}`, className)}
      {...rest}
    />
  );
});

PaginationContent.displayName = 'PaginationContent';
