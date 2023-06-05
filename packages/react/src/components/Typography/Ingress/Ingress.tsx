import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Ingress.module.css';

export type IngressProps = {
  /** Changes text sizing */
  size?: 'medium';
  /** Adds margin-bottom */
  spacing?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Use `Ingress` to display text as ingress. */
export const Ingress: OverridableComponent<IngressProps, HTMLParagraphElement> =
  forwardRef(
    (
      { className, size = 'medium', spacing, as: Component = 'p', ...rest },
      ref,
    ) => (
      <Component
        {...rest}
        ref={ref}
        className={cl(
          classes.ingress,
          classes[size],
          {
            [classes.spacing]: !!spacing,
          },
          className,
        )}
      />
    ),
  );
