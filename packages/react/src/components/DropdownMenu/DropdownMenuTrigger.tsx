import { Slot } from '@radix-ui/react-slot';
import React, { forwardRef, useContext } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';

import { DropdownMenuContext } from './DropdownMenu';

type DropdownMenuTriggerProps = {
  asChild?: boolean;
} & React.ComponentPropsWithRef<typeof Button>;

export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ asChild, children, ...rest }, ref) => {
  const Component = asChild ? Slot : Button;

  const { triggerRef, internalOpen, setInternalOpen, isControlled } =
    useContext(DropdownMenuContext);
  const mergedRefs = useMergeRefs([ref, triggerRef]);

  return (
    <Component
      ref={mergedRefs}
      onClick={() => {
        if (!isControlled) setInternalOpen(!internalOpen);
      }}
      aria-haspopup='menu'
      aria-expanded={internalOpen}
      {...rest}
    >
      {children}
    </Component>
  );
});
