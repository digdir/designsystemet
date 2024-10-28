import { forwardRef } from 'react';

import { Button, type ButtonProps } from '../Button/Button';

export type DropdownButtonProps = Omit<
  ButtonProps,
  'variant' | 'size' | 'color'
>;

export const DropdownButton = forwardRef<
  HTMLButtonElement,
  DropdownButtonProps
>(function DropdownButton({ className, ...rest }, ref) {
  return <Button ref={ref} variant='tertiary' {...rest} />;
});
