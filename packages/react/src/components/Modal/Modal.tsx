import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';

import { Button } from '../Button';

import classes from './Modal.module.css';

export type ModalProps = {
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  HTMLDialogElement
>;

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  ({ children, ...props }, ref) => {
    return (
      <dialog
        ref={ref}
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
