import React, { forwardRef, type HTMLAttributes } from 'react';
import cl from 'clsx';

import classes from './Card.module.css';

export type CardMediaProps = HTMLAttributes<HTMLDivElement>;

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      {...rest}
      className={cl(classes.media, className)}
      ref={ref}
    >
      {children}
    </div>
  ),
);
