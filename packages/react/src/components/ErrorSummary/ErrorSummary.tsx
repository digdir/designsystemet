import type { HTMLAttributes } from 'react';
import React, { useId } from 'react';
import cl from 'clsx';

import type { ListProps } from '../List';
import { List } from '../List';

import classes from './ErrorSummary.module.css';

type ErrorSummaryProps = {
  size?: ListProps['size'];
  heading: ListProps['heading'];
} & HTMLAttributes<HTMLDivElement>;

export const ErrorSummary = React.forwardRef<HTMLDivElement, ErrorSummaryProps>(
  (
    {
      size,
      heading,
      role = 'alert',
      'aria-live': ariaLive = 'polite',
      'aria-relevant': ariaRelevant = 'all',
      children,
      ...rest
    },
    ref,
  ) => {
    const headingId = useId();
    return (
      <div
        className={cl(classes.errorSummary)}
        ref={ref}
        role={role}
        aria-live={ariaLive}
        aria-relevant={ariaRelevant}
        aria-labelledby={headingId}
        {...rest}
      >
        <List
          heading={heading}
          headingId={headingId}
          size={size}
        >
          {children}
        </List>
      </div>
    );
  },
);
