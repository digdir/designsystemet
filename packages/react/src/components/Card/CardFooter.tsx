import React, { forwardRef, type HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './Card.module.css';

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, ...rest }, ref) => (
    <div
      {...rest}
      className={cl(classes.footer, rest.className)}
      ref={ref}
    >
      {children}
    </div>
  ),
);
