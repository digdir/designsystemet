import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';
import type { ComponentPropsWithRef } from 'react';

import { Button } from '../Button/Button';
import { Context } from './DialogTriggerContext';

export type DialogTriggerProps = ComponentPropsWithRef<typeof Button>;

/**
 * DialogTrigger component, used within a Dialog.TriggerContext to open a dialog.
 *
 * @example
 * <Dialog.TriggerContext>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog>
 *     Content
 *   </Dialog>
 * </Dialog.TriggerContext>
 */
export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ asChild, ...rest }, ref) {
    const contextRef = useContext(Context);
    const Component = asChild ? Slot : Button;

    return (
      <Component
        aria-haspopup='dialog'
        onClick={() => contextRef?.current?.showModal()}
        ref={ref}
        {...rest}
      />
    );
  },
);
