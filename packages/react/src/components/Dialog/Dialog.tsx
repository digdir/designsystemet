import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { DialogHTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';

import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Button } from '../Button';
import { Context } from './DialogTriggerContext';

export type DialogProps = MergeRight<
  DefaultProps & DialogHTMLAttributes<HTMLDialogElement>,
  {
    /**
     * Screen reader label of close button. Set false to hide the close button.
     * @default 'Lukk dialogvindu'
     */
    closeButton?: string | false;
    /**
     * Close on backdrop click.
     * @default false
     */
    backdropClose?: boolean;
    /**
     * Callback that is called when the dialog is closed.
     */
    onClose?: (event: Event) => void;
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
  }
>;

/**
 * Dialog component, used to display a dialog dialog.
 *
 * @example with TriggerContext
 * <Dialog.TriggerContext>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog>
 *     <Dialog.Block>
 *       Content
 *     </Dialog.Block>
 *   </Dialog>
 * </Dialog.TriggerContext>
 *
 * @example without TriggerContext
 * const dialogRef = useRef<HTMLDialogElement>(null);
 *
 * ...
 *
 * <Button onClick={() => dialogRef.current?.showDialog()}>Open Dialog</Button>
 * <Dialog ref={dialogRef}>
 *   Content
 * </Dialog>
 */
export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog(
    {
      asChild,
      children,
      className,
      closeButton = 'Lukk dialogvindu',
      onClose,
      open,
      backdropClose = false,
      ...rest
    },
    ref,
  ) {
    const contextRef = useContext(Context);
    const dialogRef = useRef<HTMLDialogElement>(null); // This local ref is used to make sure the dialog works without a DialogTriggerContext
    const Component = asChild ? Slot : 'dialog';
    const mergedRefs = useMergeRefs([contextRef, ref, dialogRef]);

    useEffect(
      () => dialogRef.current?.[open ? 'showModal' : 'close'](),
      [open],
    ); // Toggle open based on prop

    useEffect(() => {
      const dialog = dialogRef.current;
      const handleBackdropClick = ({
        clientY: y,
        clientX: x,
        target,
      }: MouseEvent) => {
        if (window.getSelection()?.toString()) return; // Fix bug where if you select text spanning two divs it thinks you clicked outside
        if (dialog && target === dialog && backdropClose) {
          const { top, left, right, bottom } = dialog.getBoundingClientRect();
          const isInDialog = top <= y && y <= bottom && left <= x && x <= right;

          if (!isInDialog) dialog?.close(); // Both <dialog> and ::backdrop is considered same event.target
        }
      };

      const handleAutoFocus = () => {
        const autofocus = dialog?.querySelector<HTMLElement>('[autofocus]');
        if (document.activeElement !== autofocus) autofocus?.focus();
      };

      dialog?.addEventListener('animationend', handleAutoFocus);
      dialog?.addEventListener('click', handleBackdropClick);
      return () => {
        dialog?.removeEventListener('animationend', handleAutoFocus);
        dialog?.removeEventListener('click', handleBackdropClick);
      };
    }, [backdropClose]);

    /* handle closing */
    useEffect(() => {
      const handleClose = (event: Event) => onClose?.(event);

      dialogRef.current?.addEventListener('close', handleClose);
      return () => dialogRef.current?.removeEventListener('close', handleClose);
    }, [onClose]);

    return (
      <Component
        className={cl('ds-dialog', className)}
        ref={mergedRefs}
        {...rest}
      >
        {closeButton !== false && (
          <form method='dialog'>
            <Button
              aria-label={closeButton}
              autoFocus
              data-color='neutral'
              icon
              name='close'
              type='submit'
              data-variant='tertiary'
            />
          </form>
        )}
        {children}
      </Component>
    );
  },
);
