import { forwardRef, useContext, useEffect } from 'react';
import type * as React from 'react';
import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';

import { Button } from '../Button';

import { PopoverContext } from './Popover';

export type PopoverTriggerProps = React.ComponentPropsWithRef<typeof Button>;

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ id, asChild, ...rest }, ref) => {
  const {
    triggerRef,
    internalOpen,
    setInternalOpen,
    isControlled,
    popoverId,
    triggerId,
    setTriggerId,
  } = useContext(PopoverContext);

  const mergedRefs = useMergeRefs([ref, triggerRef]);

  useEffect(() => {
    id && setTriggerId?.(id);
  }, [id, setTriggerId]);

  const Component = asChild ? Slot : Button;

  return (
    <Component
      ref={mergedRefs}
      onClick={() => {
        if (!isControlled) setInternalOpen(!internalOpen);
      }}
      aria-expanded={internalOpen}
      aria-controls={internalOpen ? popoverId : undefined}
      id={triggerId}
      {...rest}
    />
  );
});

PopoverTrigger.displayName = 'PopoverTrigger';
