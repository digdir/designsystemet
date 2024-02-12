import { Slot } from '@radix-ui/react-slot';
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
} & ButtonProps;

export const PaginationLink = forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ isActive, asChild, ...rest }, ref) => {
  const Component = asChild ? Slot : Button;

  const { size } = useContext(PaginationContext);

  return (
    <Component
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
