import { useMergeRefs } from '@floating-ui/react';
import { forwardRef, useContext } from 'react';
import type { ComponentPropsWithRef } from 'react';

import { PopoverTrigger } from '../Popover';
import { DropdownMenuCtx } from './DropdownMenuContext';

export type DropdownMenuTriggerProps = ComponentPropsWithRef<
  typeof PopoverTrigger
>;

export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger({ asChild, ...rest }, ref) {
  return <PopoverTrigger ref={ref} aria-haspopup='menu' {...rest} />;
});
