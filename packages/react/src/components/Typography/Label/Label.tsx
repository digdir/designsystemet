import type { LabelHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Label.module.css';

export type LabelProps = {
  /** Changes text sizing */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Adds margin-bottom */
  spacing?: boolean;
} & LabelHTMLAttributes<HTMLLabelElement>;

/** Use `Label` for labels. */
export const Label: OverridableComponent<LabelProps, HTMLLabelElement> =
  forwardRef(
    (
      { className, size = 'medium', spacing, as: Component = 'label', ...rest },
      ref,
    ) => (
      <Component
        {...rest}
        ref={ref}
        className={cl(
          classes.label,
          classes[size],
          {
            [classes.spacing]: !!spacing,
          },
          className,
        )}
      />
    ),
  );
