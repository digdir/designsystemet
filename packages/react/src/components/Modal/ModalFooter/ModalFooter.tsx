import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import classes from './ModalFooter.module.css';

export const ModalFooter = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ children, className, ...rest }, ref) => {
    return (
      <footer
        ref={ref}
        className={cl(classes.modalFooter, className)}
        {...rest}
      >
        {children}
      </footer>
    );
  },
);
