import {
  FloatingFocusManager,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';
import type React from 'react';
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
    const localModalRef = useRef<HTMLDialogElement>(null);

    const contextValue = useContext(ModalContext);
    const { modalRef, setOpen } = contextValue;
    contextValue.closeModal = () => {
      if (onBeforeClose && onBeforeClose() === false) return;

      localModalRef.current?.close();
    };
    const mergedRefs = useMergeRefs([modalRef, ref, localModalRef]);

    useScrollLock(localModalRef, classes.lockScroll);
    const open = useModalState(localModalRef);
    const { context } = useFloating();

    useEffect(() => {
      const currentModalRef = modalRef.current;

      const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === currentModalRef && onInteractOutside) {
          // Fix bug where if you select text spanning two divs it thinks you clicked outside
          if (window.getSelection()?.toString()) return;
          onInteractOutside?.();
        }
      };

      if (currentModalRef)
        currentModalRef.addEventListener('click', handleBackdropClick);

      return () => {
        if (currentModalRef) {
          currentModalRef.removeEventListener('click', handleBackdropClick);
        }
      };
    }, [onInteractOutside, modalRef, onBeforeClose, ref]);

    useEffect(() => {
      const currentModalRef = modalRef.current;

      const handleModalClose = () => {
        onClose?.();
      };

      if (currentModalRef)
        currentModalRef.addEventListener('close', handleModalClose);

      return () => {
        if (currentModalRef) {
          currentModalRef.removeEventListener('close', handleModalClose);
        }
      };
    }, [modalRef, onClose]);

    const onCancel: React.DialogHTMLAttributes<HTMLDialogElement>['onCancel'] =
      (evt) => {
        if (onBeforeClose && onBeforeClose() === false) {
          evt.preventDefault();
          return;
        }

        modalRef.current?.close();
      };

    useEffect(() => {
      setOpen(open);
    }, [open, setOpen]);

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
