import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import classes from './ModalFooter.module.css';

export const ModalFooter = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ children, ...props }, ref) => {
    return (
      <footer
        {...props}
        ref={ref}
        className={cl(classes.modalFooter, props.className)}
      >
        {children}
      </footer>
    );
  },
);
