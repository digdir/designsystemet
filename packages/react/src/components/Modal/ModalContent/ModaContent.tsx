import React from 'react';
import type { HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './ModalContent.module.css';

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

ModalContent.displayName = 'Modal.Content';
