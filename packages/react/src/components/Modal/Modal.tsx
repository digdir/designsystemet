import type { DialogHTMLAttributes } from 'react';
import React, { createContext, forwardRef, useEffect, useRef } from 'react';
import cl from 'clsx';
import {
  FloatingFocusManager,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';

import { useScrollLock } from './useScrollLock';
import classes from './Modal.module.css';
import { useModalState } from './useModalState';

export type ModalContextProps = {
  closeModal?: () => void;
};

export type ModalProps = {
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
} & DialogHTMLAttributes<HTMLDialogElement>;

export const ModalContext = createContext<ModalContextProps | null>(null);

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    { onInteractOutside, onClose, onBeforeClose, children, className, ...rest },
    ref,
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const mergedRefs = useMergeRefs([modalRef, ref]);
    const { context } = useFloating();
    useScrollLock(modalRef, classes.lockScroll);
    const open = useModalState(modalRef);

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

    return (
      <ModalContext.Provider
        value={{
          closeModal: () => {
            if (onBeforeClose && onBeforeClose() === false) return;

            modalRef.current?.close();
          },
        }}
      >
        <dialog
          ref={mergedRefs}
          {...rest}
          className={cl(classes.modal, className)}
          onCancel={onCancel}
        >
          {open && (
            <FloatingFocusManager context={context}>
              <>{children}</>
            </FloatingFocusManager>
          )}
        </dialog>
      </ModalContext.Provider>
    );
  },
);

Modal.displayName = 'Modal';
