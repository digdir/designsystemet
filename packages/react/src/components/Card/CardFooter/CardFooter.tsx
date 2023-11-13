import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Card.module.css';

export type CardFooterProps = {
  children?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, ...rest }, ref) => (
    <div
      {...rest}
      className={cn(classes.footer, classes.section, rest.className)}
      ref={ref}
    >
      {children}
    </div>
  ),
);
