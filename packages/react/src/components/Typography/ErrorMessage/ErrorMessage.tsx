import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './ErrorMessage.module.css';

export type ErrorMessageProps = {
  /** Changes text sizing */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Adds margin-bottom */
  spacing?: boolean;
  /** Toggle error color */
  error?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Use `ErrorMessage` to display text as error message. */
export const ErrorMessage: OverridableComponent<
  ErrorMessageProps,
  HTMLParagraphElement
> = forwardRef(
  (
    {
      className,
      size = 'medium',
      spacing,
      as: Component = 'div',
      error = true,
      ...rest
    },
    ref,
  ) => (
    <Component
      {...rest}
      ref={ref}
      className={cl(
        classes.errorMessage,
        classes[size],
        {
          [classes.spacing]: !!spacing,
        },
        error && classes.error,
        className,
      )}
    />
  ),
);
