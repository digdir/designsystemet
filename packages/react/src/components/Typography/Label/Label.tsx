import type { LabelHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

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
} & LabelHTMLAttributes<HTMLLabelElement>;

const fontWeightsClasses: Record<FontWeights, string> = {
  regular: classes.regularWeight,
  medium: classes.mediumWeight,
  semibold: classes.semiboldWeight,
};

/** Use `Label` for labels. */
export const Label: OverridableComponent<LabelProps, HTMLLabelElement> =
  forwardRef(
    (
      {
        className,
        size = 'medium',
        spacing,
        as: Component = 'label',
        weight = 'medium',
        ...rest
      },
      ref,
    ) => {
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
