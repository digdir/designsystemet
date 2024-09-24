import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { DialogHTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';

import { Button } from '../Button';
import { Context } from './ModalContext';

export type ModalProps = {
  /**
   * Screen reader label of close button. Set false to hide the close button.
   * @default 'Lukk dialogvindu'
   */
  closeLabel?: string | false;
  /**
   * Close on backdrop click.
   * @default false
   */
  backdropClose?: boolean;
  /**
   * Callback that is called when the modal is closed.
   * @default undefined
   */
  onClose?: () => void;
  asChild?: boolean;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    asChild,
    children,
    className,
    closeLabel = 'Lukk dialogvindu',
    onClose,
    open,
    backdropClose = false,
    ...rest
  },
  ref,
) {
  const contextRef = useContext(Context);
  const modalRef = useRef<HTMLDialogElement>(null); // This local ref is used to make sure the modal works without a ModalContext
  const Component = asChild ? Slot : 'dialog';
  const mergedRefs = useMergeRefs([contextRef, ref, modalRef]);

  useEffect(() => modalRef.current?.[open ? 'showModal' : 'close'](), [open]); // Toggle open based on prop

  useEffect(() => {
    const modal = modalRef.current;
    const handleBackdropClick = ({
      clientY: y,
      clientX: x,
      target,
    }: MouseEvent) => {
      if (window.getSelection()?.toString()) return; // Fix bug where if you select text spanning two divs it thinks you clicked outside
      if (modal && target === modal && backdropClose) {
        const { top, left, right, bottom } = modal.getBoundingClientRect();
        const isInDialog = top <= y && y <= bottom && left <= x && x <= right;

        if (!isInDialog) modal?.close(); // Both <dialog> and ::backdrop is considered same event.target
      }
    };

    const handleAutoFocus = () => {
      const autofocus = modal?.querySelector<HTMLElement>('[autofocus]');
      if (document.activeElement !== autofocus) autofocus?.focus();
    };

    modal?.addEventListener('animationend', handleAutoFocus);
    modal?.addEventListener('click', handleBackdropClick);
    return () => {
      modal?.removeEventListener('animationend', handleAutoFocus);
      modal?.removeEventListener('click', handleBackdropClick);
    };
  }, [backdropClose]);

  return (
    <Component className={cl('ds-modal', className)} ref={mergedRefs} {...rest}>
      {closeLabel !== false && (
        <form method='dialog'>
          <Button
            aria-label={closeLabel}
            autoFocus
            color='neutral'
            icon
            name='close'
            size='md'
            type='submit'
            variant='tertiary'
          />
        </form>
      )}
      {children}
    </Component>
  );
});
