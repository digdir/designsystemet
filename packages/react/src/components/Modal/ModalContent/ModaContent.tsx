import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './ModalContent.module.css';

export const ModalContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLElement>
>(({ children, className, ...rest }, ref) => {
  return (
    <div
      {...rest}
      ref={ref}
      className={cl(classes.modalContent, className)}
    >
      {children}
    </div>
  );
});
