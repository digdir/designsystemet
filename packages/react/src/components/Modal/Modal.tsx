import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { DialogHTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';

import { Button } from '../Button';
import { Context } from './ModalContext';
import { useModalState } from './useModalState';

export type ModalProps = {
  /**
   * Screen reader label of close button. Set false to hide the close button.
   * @default 'Lukk'
   */
  closeLabel?: string | false;
  /**
   * Close modal when clicking on backdrop.
   * @default undefined
   */
  onInteractOutside?: () => void;
  /**
   * Callback that is called when the modal is closed.
   * @default undefined
   */
  onClose?: () => void;
  /**
   * Called before the modal is closed when using the close button, `closeOnBackdropClick` or `ESCAPE`.
   * If the function returns `false` the modal will not close.
   */
  onBeforeClose?: () => boolean | undefined;
  asChild?: boolean;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    asChild,
    children,
    className,
    closeLabel = 'Lukk',
    onBeforeClose,
    onClose,
    onInteractOutside,
    ...rest
  },
  ref,
) {
  const { modalRef, setOpen, setCloseModal } = useContext(Context);
  const modalDialogRef = useRef<HTMLDialogElement>(null); // This local ref is used to make sure the modal works without a ModalContext
  const open = useModalState(modalDialogRef);
  const Component = asChild ? Slot : 'dialog';
  const mergedRefs = useMergeRefs([modalRef, ref, modalDialogRef]);

  useEffect(() => {
    setCloseModal?.(() => {
      if (onBeforeClose && onBeforeClose() === false) return;

      modalDialogRef.current?.close();
    });
  }, [onBeforeClose, setCloseModal]);

  useEffect(() => {
    setOpen(open);
  }, [open, setOpen]);

  useEffect(() => {
    const modalEl = modalRef.current;
    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === modalEl && onInteractOutside) {
        // Fix bug where if you select text spanning two divs it thinks you clicked outside
        if (window.getSelection()?.toString()) return;
        onInteractOutside?.();
      }
    };

    modalEl?.addEventListener('click', handleBackdropClick);
    return () => modalEl?.removeEventListener('click', handleBackdropClick);
  }, [onInteractOutside, modalRef, onBeforeClose, ref]);

  useEffect(() => {
    const modalEl = modalRef.current;
    const handleModalClose = () => onClose?.();

    modalEl?.addEventListener('close', handleModalClose);
    return () => modalEl?.removeEventListener('close', handleModalClose);
  }, [modalRef, onClose]);

  const onCancel: ModalProps['onCancel'] = (event) => {
    if (onBeforeClose && onBeforeClose() === false)
      return event.preventDefault();

    modalRef.current?.close();
  };

  return (
    <Component
      className={cl('ds-modal', className)}
      onCancel={onCancel}
      ref={mergedRefs}
      {...rest}
    >
      {closeLabel !== false && (
        <form method='dialog'>
          <Button
            aria-label={closeLabel}
            autoFocus
            className='ds-modal__header__button'
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
