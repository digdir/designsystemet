import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type PaginationListProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<HTMLAttributes<HTMLUListElement>, 'size'>;

/**
 * PaginationList component, use within a Pagination.
 *
 * @example
 * <Pagination>
 *   <PaginationList>
 *     <PaginationItem>
 *       <PaginationButton aria-label='Forrige side'>Forrige</PaginationButton>
 *     </PaginationItem>
 *   </PaginationList>
 * </Pagination>
 */
export const PaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  function PaginationList({ asChild, ...rest }, ref) {
    const Component = asChild ? Slot : 'ul';

    return <Component ref={ref} {...rest} />;
  },
);
