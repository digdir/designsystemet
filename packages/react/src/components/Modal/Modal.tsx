import type { DialogHTMLAttributes, HTMLAttributes } from 'react';
import React, { forwardRef, useEffect, useRef } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import { useMergeRefs } from '@floating-ui/react';

import { Button } from '../Button';

import classes from './Modal.module.css';

export type ModalProps = {
  /**
   * Close modal when clicking on backdrop.
   * @default false
   */
  closeOnBackdropClick?: boolean;
  children: React.ReactNode;
} & DialogHTMLAttributes<HTMLDialogElement>;

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  ({ closeOnBackdropClick = false, children, ...props }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const mergedRefs = useMergeRefs([modalRef, ref]);
    useEffect(() => {
      if (!closeOnBackdropClick) return;

      const handleBackdropClick = (e: MouseEvent) => {
        console.log('click');
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
