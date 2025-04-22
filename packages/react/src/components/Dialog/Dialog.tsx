import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { DialogHTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import { useMergeRefs } from '../../utilities/hooks';

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
     * Light dismiss behavior, allowing to close on backdrop click  by setting `closedby="any"`.
     *
     * @default 'closerequest'
     */
    closedby?: 'none' | 'closerequest' | 'any';
    /**
     * Toogle modal and non-modal dialog.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#creating_a_modal_dialog
     *
     * @default true
     */
    modal?: boolean;
    /**
     * @note Unlike standard html, where the open attribute always opens a non-modal dialog, Dialog's open prop uses the `modal` prop to determine whether the Dialog is modal or non-modal
     */
    open?: boolean;
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
 * <Button onClick={() => dialogRef.current?.showModal()}>Open Dialog</Button>
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
      closedby = 'closerequest',
      modal = true,
      onClose,
      open,
      ...rest
    },
    ref,
  ) {
    const contextRef = useContext(Context);
    const dialogRef = useRef<HTMLDialogElement>(null); // This local ref is used to make sure the dialog works without a DialogTriggerContext
    const Component = asChild ? Slot : 'dialog';
    const mergedRefs = useMergeRefs([contextRef, ref, dialogRef]);
    const showProp = modal ? 'showModal' : 'show';

    useEffect(() => dialogRef.current?.[open ? showProp : 'close'](), [open]); // Toggle open based on prop

    useEffect(() => {
      const dialog = dialogRef.current;
      const handleClosedby = (event: Event) => {
        const { clientY: y, clientX: x, target } = event as MouseEvent;
        if (event instanceof KeyboardEvent)
          return (
            closedby === 'none' &&
            event.key === 'Escape' &&
            event.preventDefault()
          ); // Skip ESC-key if closedby="none"
        if (window.getSelection()?.toString()) return; // Fix bug where if you select text spanning two divs it thinks you clicked outside
        if (dialog && target === dialog && closedby === 'any') {
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
      dialog?.addEventListener('click', handleClosedby);
      dialog?.addEventListener('keydown', handleClosedby);
      return () => {
        dialog?.removeEventListener('animationend', handleAutoFocus);
        dialog?.removeEventListener('click', handleClosedby);
        dialog?.removeEventListener('keydown', handleClosedby);
      };
    }, [closedby]);

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
        data-modal={modal}
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
              variant='tertiary'
            />
          </form>
        )}
        {children}
      </Component>
    );
  },
);
