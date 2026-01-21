import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { DialogHTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { useMergeRefs } from '../../utilities/hooks';
import { Button } from '../button/button';
import { Context } from './dialog-trigger-context';

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
     * @see [mdn closedBy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy)
     *
     * @default 'closerequest'
     */
    closedby?: 'none' | 'closerequest' | 'any';
    /**
     * When not center, displays dialog as a "drawer" from the specified side.
     *
     * @default 'center'
     */
    placement?: 'center' | 'left' | 'right' | 'top' | 'bottom';
    /**
     * Toogle modal and non-modal dialog.
     *
     * @see [mdn modal dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#creating_a_modal_dialog)
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
     *
     * @deprecated Will be removed in the next major version. Should always be a `<dialog>` element
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
      placement = 'center',
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

      const handleAutoFocus = () => {
        const autofocus = dialog?.querySelector<HTMLElement>('[autofocus]');
        if (document.activeElement !== autofocus) autofocus?.focus();
      };

      dialog?.addEventListener('animationend', handleAutoFocus);
      return () => {
        dialog?.removeEventListener('animationend', handleAutoFocus);
      };
    }, [closedby]);

    /* handle closing */
    useEffect(() => {
      const handleClose = (event: Event) => onClose?.(event);

      const currentRef = dialogRef.current;
      currentRef?.addEventListener('close', handleClose);
      return () => currentRef?.removeEventListener('close', handleClose);
    }, [onClose]);

    return (
      <Component
        className={cl('ds-dialog', className)}
        ref={mergedRefs}
        data-placement={placement}
        data-modal={modal}
        closedby={closedby}
        {...rest}
      >
        {closeButton !== false && (
          <Button
            aria-label={closeButton}
            data-color='neutral'
            icon
            variant='tertiary'
            data-command='close'
          />
        )}
        {children}
      </Component>
    );
  },
);
