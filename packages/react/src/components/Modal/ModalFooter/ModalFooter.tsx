import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './ModalFooter.module.css';

export const ModalFooter = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ children, ...props }, ref) => {
    return (
      <footer
        {...props}
        ref={ref}
        className={cn(classes.modalFooter, props.className)}
      >
        {children}
      </footer>
    );
  },
);
