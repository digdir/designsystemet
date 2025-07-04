import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { SeverityColors } from '../../colors';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type ValidationMessageProps = MergeRight<
  Omit<DefaultProps, 'data-color'> & HTMLAttributes<HTMLParagraphElement>,
  {
    /**
     * Sets color and icon.
     * @default 'danger'
     */
    'data-color'?: SeverityColors;
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
  }
>;

/**
 * Use `ValidationMessage` to display validation text
 *
 * @example
 * <ValidationMessage>This is a danger validation message</ValidationMessage>
 */
export const ValidationMessage = forwardRef<
  HTMLParagraphElement,
  ValidationMessageProps
>(function ValidationMessage({ className, asChild, ...rest }, ref) {
  const Component = asChild ? Slot : 'p';

  return (
    <Component
      className={cl('ds-validation-message', className)}
      data-field='validation'
      ref={ref}
      {...rest}
    />
  );
});
