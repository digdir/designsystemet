import type { DialogHTMLAttributes, HTMLAttributes } from 'react';
import React, { forwardRef, useEffect, useRef } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';
import { useScrollLock } from '../../utils/useScrollLock';

import classes from './Modal.module.css';

// TODO: Add scroll lock

export type ModalProps = {
  /**
   * Close modal when clicking on backdrop.
   * @default false
   */
  closeOnBackdropClick?: boolean;
  /**
   * Callback that is called when the modal is closed.
   * @default undefined
   */
  onClose?: () => void;
  children: React.ReactNode;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    { closeOnBackdropClick = false, onClose = undefined, children, ...props },
    ref,
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const mergedRefs = useMergeRefs([modalRef, ref]);
    useScrollLock(modalRef, classes.lockScroll);

    useEffect(() => {
      if (!closeOnBackdropClick) return;

      const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === modalRef.current && closeOnBackdropClick) {
          modalRef.current?.close();
        }
      };

      const currentModalRef = modalRef.current;

      if (currentModalRef)
        currentModalRef.addEventListener('click', handleBackdropClick);

      return () => {
        if (currentModalRef) {
          currentModalRef.removeEventListener('click', handleBackdropClick);
        }
      };
    }, [closeOnBackdropClick, modalRef, ref]);

    // check when modal is closed
    useEffect(() => {
      if (!onClose) return;

      const handleModalClose = () => {
        onClose();
      };

      const currentModalRef = modalRef.current;

      if (currentModalRef)
        currentModalRef.addEventListener('close', handleModalClose);

      return () => {
        if (currentModalRef) {
          currentModalRef.removeEventListener('close', handleModalClose);
        }
      };
    }, [modalRef, onClose]);

    return (
      <dialog
        ref={mergedRefs}
        {...props}
        className={cn(classes.modal, props.className)}
      >
        {children}
      </dialog>
    );
  },
);

export type ModalHeaderProps = {
  closeModal?: () => void;
  children: React.ReactNode;
} & HTMLAttributes<HTMLElement>;

export const ModalHeader = ({
  closeModal,
  children,
  ...props
}: ModalHeaderProps) => {
  return (
    <div
      {...props}
      className={cn(classes.modalHeader, props.className)}
    >
      {children}
      {closeModal && (
        <Button
          variant='tertiary'
          size='small'
          onClick={closeModal}
        >
          <XMarkIcon
            title='close modal'
            fontSize='1.5em'
          />
        </Button>
      )}
    </div>
  );
};

export const ModalContent = ({
  children,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      {...props}
      className={cn(classes.modalContent, props.className)}
    >
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      {...props}
      className={cn(classes.modalFooter, props.className)}
    >
      {children}
    </div>
  );
};

Modal.displayName = 'Modal';
ModalHeader.displayName = 'Modal.Header';
ModalContent.displayName = 'Modal.Content';
ModalFooter.displayName = 'Modal.Footer';
