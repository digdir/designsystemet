import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './ErrorMessage.module.css';

export type ErrorMessageProps = {
  /** Changes text sizing */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Adds margin-bottom */
  spacing?: boolean;
  /** Toggle error color */
  error?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
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
      as = 'div',
      asChild,
      error = true,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : as;

    return (
      <Component
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
        {...rest}
      />
    );
  },
);

ErrorMessage.displayName = 'ErrorMessage';
