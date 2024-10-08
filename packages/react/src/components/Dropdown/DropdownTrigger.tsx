import { forwardRef } from 'react';
import type { ComponentPropsWithRef } from 'react';

import { PopoverTrigger } from '../Popover';

export type DropdownTriggerProps = ComponentPropsWithRef<typeof PopoverTrigger>;

export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(function DropdownTrigger({ asChild, ...rest }, ref) {
  return <PopoverTrigger ref={ref} {...rest} />;
});
