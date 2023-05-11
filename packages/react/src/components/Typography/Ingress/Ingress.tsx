import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Ingress.module.css';

export type IngressProps = {
  /** Changes text sizing */
  size?: 'medium' | 'large';
  /** Adds margin-bottom */
  spacing?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Renders body text. Control text styles with props */
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
