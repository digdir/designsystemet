import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './ModalContent.module.css';

export const ModalContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLElement>
>(({ children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(classes.modalContent, props.className)}
    >
      {children}
    </div>
  );
});
