import { type AriaAttributes, forwardRef, useContext } from 'react';

import { Button, type ButtonProps } from '../Button/Button';

import { PaginationContext } from './Pagination';

export type PaginationButtonProps = {
  /**
   * Toggle button as active
   * @default false
   */
  'aria-current'?: AriaAttributes['aria-current'];
} & Omit<ButtonProps, 'icon' | 'loading' | 'size'>;

export const PaginationButton = forwardRef<
  HTMLButtonElement,
  PaginationButtonProps
>(function PaginationButton(rest, ref) {
  const { size } = useContext(PaginationContext);

  return <Button ref={ref} size={size} {...rest} />;
});
