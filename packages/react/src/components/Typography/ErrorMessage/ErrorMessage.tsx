import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './ErrorMessage.module.css';

export type ErrorMessageProps = {
  /** Changes text sizing */
  size?: 'xsmall' | 'small' | 'medium';
  /** Adds margin-bottom */
  spacing?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Use `ErrorMessage` to display text as error message. */
export const ErrorMessage: OverridableComponent<
  ErrorMessageProps,
  HTMLParagraphElement
> = forwardRef(
  (
    { className, size = 'medium', spacing, as: Component = 'p', ...rest },
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
        className,
      )}
    />
  ),
);
