import { forwardRef, useContext } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';

import { PaginationContext } from './PaginationRoot';

export type PaginationLinkProps = {
  /**
   * Set current link as active
   * @default false
   */
  isActive?: boolean;
} & Omit<ButtonProps, 'size' | 'icon'>;

export const PaginationLink = forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ isActive, ...rest }, ref) => {
  const { size } = useContext(PaginationContext);

  return (
    <Button
      ref={ref}
      variant={isActive ? 'primary' : 'tertiary'}
      aria-current={isActive}
      color={'first'}
      size={size}
      {...rest}
    />
  );
});

export default PaginationLink;
