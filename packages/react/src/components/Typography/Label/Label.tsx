import type { LabelHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

import { getSize } from '../../../utilities/getSize';

type OldLabelSizes = 'xsmall' | 'small' | 'medium' | 'large';
type FontWeights = 'regular' | 'medium' | 'semibold';

export type LabelProps = {
  /**
   * Changes text sizing
   *
   * @default md
   * @note `xsmall`, `small`, `medium`, `large` is deprecated
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | OldLabelSizes;
  /** Adds margin-bottom */
  spacing?: boolean;
  /** Adjusts font weight. Use this when you have a label hierarchy, such as checkboxes/radios in a fieldset */
  weight?: FontWeights;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & LabelHTMLAttributes<HTMLLabelElement>;

/** Use `Label` for labels. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, spacing, weight = 'medium', asChild, ...rest }, ref) => {
    const Component = asChild ? Slot : 'label';
    const size = getSize(rest.size || 'md');

    return (
      <Component
        ref={ref}
        className={cl(
          'fds-label',
          `fds-label--${size}`,
          spacing && 'fds-label--spacing',
          weight && `fds-label--${weight}-weight`,
          className,
        )}
        {...rest}
      />
    );
  },
);

Label.displayName = 'Label';
