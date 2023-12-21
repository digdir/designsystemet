import React, { forwardRef, type HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './Card.module.css';

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, ...rest }, ref) => (
    <div
      {...rest}
      className={cl(classes.header, rest.className)}
      ref={ref}
    >
      {children}
    </div>
  ),
);
