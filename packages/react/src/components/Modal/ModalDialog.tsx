import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { DialogHTMLAttributes } from 'react';
import { forwardRef, useContext, useEffect, useRef } from 'react';

import { ModalContext } from './ModalRoot';
import { useModalState } from './useModalState';
import { useScrollLock } from './useScrollLock';

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
  onBeforeClose?: () => boolean | undefined;
  asChild?: boolean;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const ModalDialog = forwardRef<HTMLDialogElement, ModalDialogProps>(
  (
    {
      onInteractOutside,
      onClose,
      onBeforeClose,
      asChild,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'dialog';

    // This local ref is used to make sure the modal works without a ModalRoot
    const modalDialogRef = useRef<HTMLDialogElement>(null);
    const { modalRef, setOpen, setCloseModal } = useContext(ModalContext);
    const open = useModalState(modalDialogRef);

    useEffect(() => {
      setCloseModal?.(() => {
        if (onBeforeClose && onBeforeClose() === false) return;

        modalDialogRef.current?.close();
      });
    }, [onBeforeClose, setCloseModal]);

    const mergedRefs = useMergeRefs([modalRef, ref, modalDialogRef]);
    useScrollLock(modalDialogRef, 'ds-modal--lock-scroll');

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
        className={cl('ds-modal', className)}
        onCancel={onCancel}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

ModalDialog.displayName = 'ModalDialog';
