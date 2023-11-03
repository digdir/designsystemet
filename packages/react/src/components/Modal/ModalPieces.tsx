import React from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import type { HTMLAttributes } from 'react';
import cn from 'classnames';

import { Button } from '../Button';

import classes from './Modal.module.css';

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
    <header
      {...props}
      className={cn(classes.modalHeader, props.className)}
    >
      {children}
      {closeModal && (
        <Button
          variant='tertiary'
          size='small'
          onClick={closeModal}
          autoFocus
        >
          <XMarkIcon
            title='close modal'
            fontSize='1.5em'
          />
        </Button>
      )}
    </header>
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
    <footer
      {...props}
      className={cn(classes.modalFooter, props.className)}
    >
      {children}
    </footer>
  );
};

ModalHeader.displayName = 'Modal.Header';
ModalContent.displayName = 'Modal.Content';
ModalFooter.displayName = 'Modal.Footer';
