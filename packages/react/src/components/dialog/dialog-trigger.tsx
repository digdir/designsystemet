import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithRef } from 'react';
import { forwardRef, useContext } from 'react';

import { Button } from '../button/button';
import { Context } from './dialog-trigger-context';

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
    const { id, modal } = useContext(Context);
    const Component = asChild ? Slot : Button;

    return (
      <Component
        suppressHydrationWarning // Might get augmented through designsystemet-web with aria-haspopup
        command={modal ? 'show-modal' : 'show'}
        commandfor={id}
        ref={ref}
        {...rest}
      />
    );
  },
);
