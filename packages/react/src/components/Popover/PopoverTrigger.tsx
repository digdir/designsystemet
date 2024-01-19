import { Slot } from '@radix-ui/react-slot';
import React, { forwardRef, useContext } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';

import { PopoverContext } from './Popover';

type PopoverTriggerProps = {
  asChild?: boolean;
} & React.ComponentProps<typeof Button>;

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ asChild, children, ...rest }: PopoverTriggerProps, ref) => {
  const Component = asChild ? Slot : Button;

  const { anchorEl, open, setIsOpen } = useContext(PopoverContext);
  const mergedRefs = useMergeRefs([ref, anchorEl]);

  return (
    <Component
      ref={mergedRefs}
      onClick={() => {
        setIsOpen(!open);
      }}
      aria-expanded={open}
      {...rest}
    >
      {children}
    </Component>
  );
});
