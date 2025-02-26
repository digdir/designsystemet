import { forwardRef } from 'react';

import { Button, type ButtonProps } from '../Button/Button';

export type DropdownButtonProps = Omit<ButtonProps, 'data-variant'>;

export const DropdownButton = forwardRef<
  HTMLButtonElement,
  DropdownButtonProps
>(function DropdownButton({ className, ...rest }, ref) {
  return <Button ref={ref} data-variant='tertiary' {...rest} />;
});
