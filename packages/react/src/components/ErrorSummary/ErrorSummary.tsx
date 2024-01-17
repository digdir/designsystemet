import type { HTMLAttributes } from 'react';
import React from 'react';
import cl from 'clsx';

import type { ListProps } from '../List';
import { List } from '../List';

import classes from './ErrorSummary.module.css';

type ErrorSummaryProps = {
  size?: ListProps['size'];
  heading: ListProps['heading'];
} & HTMLAttributes<HTMLDivElement>;

export const ErrorSummary = React.forwardRef<HTMLDivElement, ErrorSummaryProps>(
  ({ size, heading, role, children, ...rest }, ref) => {
    return (
      <div
        className={cl(classes.errorSummary)}
        ref={ref}
        role={role ?? 'alert'}
        {...rest}
      >
        <List
          heading={heading}
          size={size}
        >
          {children}
        </List>
      </div>
    );
  },
);
