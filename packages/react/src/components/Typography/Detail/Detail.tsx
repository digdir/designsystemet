import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Detail.module.css';

export type DetailProps = {
  /** Adds margin-bottom */
  spacing?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Use `Detail` for displaying detailed text. */
export const Detail: OverridableComponent<DetailProps, HTMLParagraphElement> =
  forwardRef(({ className, spacing, as: Component = 'p', ...rest }, ref) => (
    <Component
      {...rest}
      ref={ref}
      className={cl(
        classes.detail,
        {
          [classes.spacing]: !!spacing,
        },
        className,
      )}
    />
  ));
