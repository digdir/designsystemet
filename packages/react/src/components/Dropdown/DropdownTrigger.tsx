import { forwardRef } from 'react';

import { PopoverTrigger, type PopoverTriggerProps } from '../Popover';

export type DropdownTriggerProps = PopoverTriggerProps;

export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(function DropdownTrigger({ asChild, ...rest }, ref) {
  return <PopoverTrigger ref={ref} {...rest} />;
});
