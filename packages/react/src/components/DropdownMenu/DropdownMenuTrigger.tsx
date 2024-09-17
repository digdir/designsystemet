import { forwardRef } from 'react';
import type { ComponentPropsWithRef } from 'react';

import { PopoverTrigger } from '../Popover';

export type DropdownMenuTriggerProps = ComponentPropsWithRef<
  typeof PopoverTrigger
>;

export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger({ asChild, ...rest }, ref) {
  return <PopoverTrigger ref={ref} aria-haspopup='menu' {...rest} />;
});
