import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { LabelHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type LabelProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & LabelHTMLAttributes<HTMLLabelElement> &
  DefaultProps;

/**
 * Use `Label` for labels. Renders a native `label` element.
 *
 * @example
 * <Label data-size='lg'>Label</Label>
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, asChild, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'label';

  return (
    <Component
      ref={ref}
      className={cl('ds-label', className)}
      suppressHydrationWarning // Since <ds-field> will add for attribute dynamically
      {...rest}
    />
  );
});
