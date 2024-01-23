import React, { forwardRef, type HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './Card.module.css';

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      className={cl(classes.content, className)}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  ),
);
