import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';

import { Button } from '../Button';

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

export const ModalHeader = ({ closeModal, children }: ModalHeaderProps) => {
  return (
    <div>
      {children}
      {closeModal && (
        <Button
          variant='tertiary'
          size='small'
          onClick={closeModal}
        >
          <XMarkIcon title='close modal' />
        </Button>
      )}
    </div>
  );
};

Modal.displayName = 'Modal';
ModalHeader.displayName = 'Modal.Header';
