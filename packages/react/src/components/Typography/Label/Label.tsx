import type { LabelHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

export type LabelProps = {
  /**
   * Changes text sizing
   * @default md
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Adds margin-bottom */
  spacing?: boolean;
  /**
   * Adjusts font weight. Use this when you have a label hierarchy, such as checkboxes/radios in a fieldset
   * @default 'medium'
   */
  weight?: 'regular' | 'medium' | 'semibold';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & LabelHTMLAttributes<HTMLLabelElement>;

/**
 * Use `Label` for labels.
 *
 * @example
 * <Label size='lg'>Label</Label>
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    { className, spacing, size = 'md', weight = 'medium', asChild, ...rest },
    ref,
  ) => {
    const Component = asChild ? Slot : 'label';

    return (
      <Component
        ref={ref}
        className={cl(
          'ds-label',
          `ds-label--${size}`,
          spacing && 'ds-label--spacing',
          weight && `ds-font-weight--${weight}`,
          className,
        )}
        {...rest}
      />
    );
  },
);

Label.displayName = 'Label';
