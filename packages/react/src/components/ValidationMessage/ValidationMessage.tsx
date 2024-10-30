import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type ValidationMessageProps = {
  /** Toggle error color */
  error?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLParagraphElement> &
  DefaultProps;

/** Use `ValidationMessage` to display validation text */
export const ValidationMessage = forwardRef<
  HTMLParagraphElement,
  ValidationMessageProps
>(function ValidationMessage(
  { className, asChild, error = true, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={cl('ds-validation-message', className)}
      data-error={error || undefined}
      data-field='validation'
      ref={ref}
      {...rest}
    />
  );
});
