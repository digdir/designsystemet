import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';
import type * as React from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';

import { PopoverContext } from './Popover';

export type PopoverTriggerProps = {
  asChild?: boolean;
} & React.ComponentPropsWithRef<typeof Button>;

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ asChild, children, ...rest }, ref) => {
  const Component = asChild ? Slot : Button;

  const { triggerRef, internalOpen, setInternalOpen, isControlled } =
    useContext(PopoverContext);
  const mergedRefs = useMergeRefs([ref, triggerRef]);

  return (
    <Component
      ref={mergedRefs}
      onClick={() => {
        if (!isControlled) setInternalOpen(!internalOpen);
      }}
      aria-expanded={internalOpen}
      {...rest}
    >
      {children}
    </Component>
  );
});

PopoverTrigger.displayName = 'PopoverTrigger';
