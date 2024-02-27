import { forwardRef, useContext, useEffect } from 'react';
import type * as React from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';

import { PopoverContext } from './Popover';

export type PopoverTriggerProps = React.ComponentPropsWithRef<typeof Button>;

export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ id, ...rest }, ref) => {
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

  return (
    <Button
      ref={mergedRefs}
      onClick={() => {
        if (!isControlled) setInternalOpen(!internalOpen);
      }}
      aria-expanded={internalOpen}
      role='button'
      aria-controls={internalOpen ? popoverId : undefined}
      id={triggerId}
      type='button'
      {...rest}
    />
  );
});

PopoverTrigger.displayName = 'PopoverTrigger';
