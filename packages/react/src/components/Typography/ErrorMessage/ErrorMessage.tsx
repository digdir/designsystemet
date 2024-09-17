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
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Use `ErrorMessage` to display text as error message. */
export const ErrorMessage = forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  function ErrorMessage(
    { size = 'md', className, spacing, asChild, ...rest },
    ref,
  ) {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={ref}
        className={cl('ds-error-message', className)}
        data-size={size}
        data-spacing={spacing || undefined}
        {...rest}
      />
    );
  },
);
