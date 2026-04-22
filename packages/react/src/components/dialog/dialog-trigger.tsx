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
    const contextRef = useContext(Context); // Using contextRef instead of command as this is instantly available and plays nice with tests
    const Component = asChild ? Slot : Button;

    const openDialog = () => {
      /* check if element has `data-modal`, it it has, use `showModal` */
      contextRef.current?.getAttribute('data-modal') === 'true'
        ? contextRef.current?.showModal()
        : contextRef.current?.show();
    };

    return (
      <Component
        aria-haspopup='dialog'
        onClick={openDialog}
        ref={ref}
        suppressHydrationWarning // Might get augmented through designsystemet-web with aria-haspopup
        {...rest}
      />
    );
  },
);
