import { type AriaAttributes, forwardRef, useContext } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';

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
>(function PaginationButton({ 'aria-current': ariaCurrent, ...rest }, ref) {
  const { size } = useContext(PaginationContext);
  const isActive = ariaCurrent && ariaCurrent !== 'false';

  return (
    <Button
      aria-current={ariaCurrent}
      ref={ref}
      size={size}
      variant={isActive ? 'primary' : 'tertiary'}
      {...rest}
    />
  );
});
