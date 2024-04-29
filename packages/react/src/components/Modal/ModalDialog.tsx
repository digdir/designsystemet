import { FloatingFocusManager, useFloating, useMergeRefs } from '@floating-ui/react';
import type { DialogHTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx';

import classes from './Modal.module.css';
import { useScrollLock } from './useScrollLock';
import { useModalState } from './useModalState';
import { ModalContext } from './ModalRoot';

export type ModalDialogProps = {
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
  onBeforeClose?: () => boolean | void;
  asChild?: boolean;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const ModalDialog = forwardRef<HTMLDialogElement, ModalDialogProps>(
  ({ onInteractOutside, onClose, onBeforeClose, asChild, className, children, ...rest }, ref) => {
    const Component = asChild ? Slot : 'dialog';

    // This local ref is used to make sure the modal works without a ModalRoot
    const modalDialogRef = useRef<HTMLDialogElement>(null);
    const { context } = useFloating();
    const modal = useContext(ModalContext);
    const open = useModalState(modalDialogRef);

    const { modalRef, setOpen } = modal;

    modal.closeModal = () => {
      if (onBeforeClose && onBeforeClose() === false) return;

      modalDialogRef.current?.close();
    };

    const mergedRefs = useMergeRefs([modalRef, ref, modalDialogRef]);
    useScrollLock(modalDialogRef, classes.lockScroll);

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

      if (modalEl) modalEl.addEventListener('click', handleBackdropClick);

      return () => {
        if (modalEl) {
          modalEl.removeEventListener('click', handleBackdropClick);
        }
      };
    }, [onInteractOutside, modalRef, onBeforeClose, ref]);

    useEffect(() => {
      const modalEl = modalRef.current;

      const handleModalClose = () => {
        onClose?.();
      };

      if (modalEl) modalEl.addEventListener('close', handleModalClose);

      return () => {
        if (modalEl) {
          modalEl.removeEventListener('close', handleModalClose);
        }
      };
    }, [modalRef, onClose]);

    const onCancel: ModalDialogProps['onCancel'] = (e) => {
      if (onBeforeClose && onBeforeClose() === false) {
        e.preventDefault();
        return;
      }

      modalRef.current?.close();
    };

    return (
      <Component
        ref={mergedRefs}
        className={cl(classes.modal, className)}
        onCancel={onCancel}
        {...rest}
      >
        {open && (
          <FloatingFocusManager context={context}>
            <>{children}</>
          </FloatingFocusManager>
        )}
      </Component>
    );
  },
);

ModalDialog.displayName = 'ModalDialog';
