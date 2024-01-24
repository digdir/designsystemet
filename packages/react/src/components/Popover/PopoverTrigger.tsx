import { Slot } from '@radix-ui/react-slot';
import React, { forwardRef, useContext } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';

import { PopoverContext } from './Popover';

type PopoverTriggerProps = {
  asChild?: boolean;
} & React.ComponentPropsWithRef<typeof Button>;

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ asChild, children, ...rest }: PopoverTriggerProps, ref) => {
  const Component = asChild ? Slot : Button;

  const { triggerRef, internalOpen, setInternalOpen, open } =
    useContext(PopoverContext);
  const mergedRefs = useMergeRefs([ref, triggerRef]);

  return (
    <Component
      ref={mergedRefs}
      onClick={() => {
        if (typeof open !== 'boolean') setInternalOpen(!internalOpen);
      }}
      aria-expanded={internalOpen}
      {...rest}
    >
      {children}
    </Component>
  );
});
