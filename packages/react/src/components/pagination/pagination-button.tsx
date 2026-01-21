import { Slot } from '@radix-ui/react-slot';
import { type AriaAttributes, forwardRef, type HTMLAttributes } from 'react';

export type PaginationButtonProps = {
  /**
   * Toggle button as active
   * @default false
   */
  'aria-current'?: AriaAttributes['aria-current'];
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

/**
 * PaginationButton component, use within a Pagination.Item.
 *
 * @example
 * <PaginationItem>
 *   <PaginationButton aria-label='Forrige side'>Forrige</PaginationButton>
 * </PaginationItem>
 */
export const PaginationButton = forwardRef<
  HTMLButtonElement,
  PaginationButtonProps
>(function PaginationButton({ asChild, ...rest }, ref) {
  const Component = asChild ? Slot : 'button';

  return <Component ref={ref} {...rest} />;
});
