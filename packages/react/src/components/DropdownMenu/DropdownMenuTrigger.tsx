import { forwardRef, useContext } from 'react';
import type * as React from 'react';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';

import { DropdownMenuContext } from './DropdownMenu';

export type DropdownMenuTriggerProps = React.ComponentPropsWithRef<
  typeof Button
>;

export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ ...rest }, ref) => {
  const { triggerRef, internalOpen, setInternalOpen, isControlled } =
    useContext(DropdownMenuContext);
  const mergedRefs = useMergeRefs([ref, triggerRef]);

  return (
    <Button
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
