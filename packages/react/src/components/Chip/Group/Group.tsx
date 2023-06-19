import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Group.module.css';

type GroupProps = HTMLAttributes<HTMLUListElement>;

export const Group = forwardRef<HTMLUListElement, GroupProps>(
  ({ children, ...rest }: GroupProps, ref): JSX.Element => (
    <ul
      {...rest}
      ref={ref}
      className={cn(classes.list, rest.className)}
    >
      {React.Children.toArray(children).map(
        (child, index): JSX.Element => (
          <li key={`${child.toString()}-${index}`}>{child}</li>
        ),
      )}
    </ul>
  ),
);
