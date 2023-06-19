import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import type { ChipProps } from '../Chip';

import classes from './Group.module.css';

export type GroupProps = {
  size?: 'xsmall' | 'small';
} & HTMLAttributes<HTMLUListElement>;

export const Group = forwardRef<HTMLUListElement, GroupProps>(
  ({ children, size = 'xsmall', ...rest }: GroupProps, ref): JSX.Element => (
    <ul
      {...rest}
      ref={ref}
      className={cn(classes.groupContainer, classes[size], rest.className)}
    >
      {React.Children.toArray(children).map(
        (child, index): JSX.Element => (
          <li key={`${child.toString()}-${index}`}>
            {React.isValidElement(child) &&
              React.cloneElement(child as React.ReactElement<ChipProps>, {
                size,
              })}
          </li>
        ),
      )}
    </ul>
  ),
);
