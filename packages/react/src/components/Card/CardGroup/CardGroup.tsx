import type { HTMLAttributes } from 'react';
import React, { forwardRef, isValidElement, Children } from 'react';
import cn from 'classnames';

import classes from '../Card.module.css';

export type CardGroupProps = HTMLAttributes<HTMLUListElement>;

export const CardGroup = forwardRef<HTMLUListElement, CardGroupProps>(
  ({ children, ...rest }: CardGroupProps, ref) => (
    <ul
      {...rest}
      ref={ref}
      className={cn(classes.group, rest.className)}
    >
      {Children.toArray(children).map((child, index) =>
        isValidElement(child) ? <li key={`card-${index}`}>{child}</li> : null,
      )}
    </ul>
  ),
);
