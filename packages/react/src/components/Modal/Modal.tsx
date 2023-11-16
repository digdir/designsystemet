import type { DialogHTMLAttributes } from 'react';
import React, { createContext, forwardRef, useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  FloatingFocusManager,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';

import { useMediaQuery } from '../../hooks';

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
   * The width of the modal.
   * Will go to full width below the specified width.
   * @default '650px'
   */
  width?: string;
  /**
   * Called before the modal is closed when using the close button, `closeOnBackdropClick` or `ESCAPE`.
   * If the function returns `false` the modal will not close.
   */
  onBeforeClose?: () => boolean | void;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const ModalContext = createContext<ModalContextProps | null>(null);

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      onInteractOutside,
      onClose,
      width = '650px',
      onBeforeClose,
      children,
      ...props
    },
    ref,
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const mergedRefs = useMergeRefs([modalRef, ref]);
    const { context } = useFloating();
    useScrollLock(modalRef, classes.lockScroll);
    const open = useModalState(modalRef);
    const belowWidth = useMediaQuery(`(max-width: ${width})`);

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
          {...props}
          className={cn(classes.modal, props.className)}
          style={{
            minWidth: belowWidth ? '100%' : width,
            maxWidth: belowWidth
              ? '100%'
              : `min(${width}, calc(100% - 6px - 2em))`,
            ...props.style,
          }}
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
