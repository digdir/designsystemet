import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from '../Card.module.css';

export type CardGroupProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLUListElement>;

export const CardGroup = forwardRef<HTMLUListElement, CardGroupProps>(
  ({ children, ...rest }: CardGroupProps, ref) => (
    <ul
      {...rest}
      ref={ref}
      className={cn(classes.groupContainer, rest.className)}
    >
      {React.Children.toArray(children).map((child, index) =>
        React.isValidElement(child) ? (
          <li key={`card-${index}`}>{child}</li>
        ) : null,
      )}
    </ul>
  ),
);
