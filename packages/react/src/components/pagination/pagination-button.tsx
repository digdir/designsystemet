import { type AriaAttributes, forwardRef } from 'react';

import { Button, type ButtonProps } from '../button/button';

export type PaginationButtonProps = {
  /**
   * Toggle button as active
   * @default false
   */
  'aria-current'?: AriaAttributes['aria-current'];
} & Omit<ButtonProps, 'icon' | 'loading'>;

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
>(function PaginationButton(rest, ref) {
  return <Button ref={ref} {...rest} />;
});
