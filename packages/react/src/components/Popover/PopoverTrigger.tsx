import { forwardRef, useContext } from 'react';
import type * as React from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';

import { PopoverContext } from './Popover';

export type PopoverTriggerProps = React.ComponentPropsWithRef<typeof Button>;

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ ...rest }, ref) => {
  const { triggerRef, internalOpen, setInternalOpen, isControlled } =
    useContext(PopoverContext);
  const mergedRefs = useMergeRefs([ref, triggerRef]);

  return (
    <Button
      ref={mergedRefs}
      onClick={() => {
        if (!isControlled) setInternalOpen(!internalOpen);
      }}
      aria-expanded={internalOpen}
      {...rest}
    />
  );
});

PopoverTrigger.displayName = 'PopoverTrigger';
