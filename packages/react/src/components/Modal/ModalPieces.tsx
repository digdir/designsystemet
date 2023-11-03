import React from 'react';
import type { HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './Modal.module.css';

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

ModalContent.displayName = 'Modal.Content';
ModalFooter.displayName = 'Modal.Footer';
