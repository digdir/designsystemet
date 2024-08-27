import { forwardRef, useContext } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';

import { PaginationContext } from './PaginationRoot';

export type PaginationButtonProps = {
  /**
   * Toggle button as active
   * @default false
   */
  isActive?: boolean;
} & Omit<ButtonProps, 'size'>;

export const PaginationButton = forwardRef<
  HTMLButtonElement,
  PaginationButtonProps
>(({ isActive, ...rest }, ref) => {
  const { size } = useContext(PaginationContext);

  return (
    <Button
      ref={ref}
      variant={isActive ? 'primary' : 'tertiary'}
      aria-current={isActive}
      size={size}
      {...rest}
    />
  );
});

PaginationButton.displayName = 'PaginationButton';
