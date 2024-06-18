import { forwardRef, useContext } from 'react';
import type * as React from 'react';
import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';

import { Button } from '../Button';

import { DropdownMenuContext } from './DropdownMenuRoot';

export type DropdownMenuTriggerProps = React.ComponentPropsWithRef<
  typeof Button
>;

export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ asChild, ...rest }, ref) => {
  const { triggerRef, internalOpen, setInternalOpen, isControlled } =
    useContext(DropdownMenuContext);
  const mergedRefs = useMergeRefs([ref, triggerRef]);

  const Component = asChild ? Slot : Button;

  return (
    <Component
      ref={mergedRefs}
      onClick={() => {
        if (!isControlled) setInternalOpen(!internalOpen);
      }}
      aria-haspopup='menu'
      aria-expanded={internalOpen}
      {...rest}
    />
  );
});

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
