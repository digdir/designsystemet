import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type ErrorMessageProps = {
  /**
   * Changes text sizing
   * @default md
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
export const ErrorMessage = forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  (
    { size = 'md', className, spacing, asChild, error = true, ...rest },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        className={cl(
          'ds-error-message',
          `ds-error_message--${size}`,
          spacing && 'ds-error-message--spacing',
          error && 'ds-error-message--error',
          className,
        )}
        {...rest}
      />
    );
  },
);

ErrorMessage.displayName = 'ErrorMessage';
