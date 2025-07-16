import { forwardRef } from 'react';

import { Button, type ButtonProps } from '../button/button';

export type DropdownButtonProps = Omit<ButtonProps, 'variant'>;

/**
 * DropdownButton component, used to display a button in the DropdownItem.
 *
 * @example
 * <Dropdown>
 *  <DropdownList>
 *    <DropdownItem>
 *      <DropdownButton>Button</DropdownButton>
 *    </DropdownItem>
 *  </DropdownList>
 * </Dropdown>
 */
export const DropdownButton = forwardRef<
  HTMLButtonElement,
  DropdownButtonProps
>(function DropdownButton({ ...rest }, ref) {
  return <Button ref={ref} variant='tertiary' {...rest} />;
});
