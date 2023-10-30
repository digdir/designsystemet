import React, { type HTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';

import classes from './Card.module.css';

export type CardProps = {
  /** Instances of `Card.Section` */
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={cn(classes.card, rest.className)}
    >
      {children}
    </div>
  ),
);
