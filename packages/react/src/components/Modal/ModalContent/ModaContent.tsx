import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './ModalContent.module.css';

export const ModalContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLElement>
>(({ children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cl(classes.modalContent, props.className)}
    >
      {children}
    </div>
  );
});
