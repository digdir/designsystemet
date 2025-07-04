import { forwardRef } from 'react';

import { Button, type ButtonProps } from '../button/button';

export type DropdownButtonProps = Omit<ButtonProps, 'variant'>;

export const DropdownButton = forwardRef<
  HTMLButtonElement,
  DropdownButtonProps
>(function DropdownButton({ ...rest }, ref) {
  return <Button ref={ref} variant='tertiary' {...rest} />;
});
