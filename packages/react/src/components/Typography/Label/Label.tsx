import type { LabelHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './Label.module.css';

type FontWeights = 'regular' | 'medium' | 'semibold';

export type LabelProps = {
  /** Changes text sizing */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
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

const fontWeightsClasses: Record<FontWeights, string> = {
  regular: classes.regularWeight,
  medium: classes.mediumWeight,
  semibold: classes.semiboldWeight,
};

/** Use `Label` for labels. */
export const Label: OverridableComponent<LabelProps, HTMLLabelElement> = forwardRef(
  ({ className, size = 'medium', spacing, as = 'label', weight = 'medium', asChild, ...rest }, ref) => {
    const Component = asChild ? Slot : as;

    return (
      <Component
        ref={ref}
        className={cl(
          classes.label,
          classes[size],
          spacing && classes.spacing,
          weight && [fontWeightsClasses[weight]],
          className,
        )}
        {...rest}
      />
    );
  },
);

Label.displayName = 'Label';
