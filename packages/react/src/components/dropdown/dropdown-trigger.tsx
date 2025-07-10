import { forwardRef } from 'react';
import {
  PopoverTrigger,
  type PopoverTriggerProps,
} from '../popover/popover-trigger';

export type DropdownTriggerProps = PopoverTriggerProps;

export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(function DropdownTrigger({ asChild, ...rest }, ref) {
  return <PopoverTrigger ref={ref} {...rest} />;
});
