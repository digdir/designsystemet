import React, { forwardRef, type HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from '../Card.module.css';

export type CardContentProps = {
  children?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...rest }, ref) => (
    <div
      {...rest}
      className={cn(
        classes.content,
        classes.section,
        classes.column,
        rest.className,
      )}
      ref={ref}
    >
      {children}
    </div>
  ),
);
