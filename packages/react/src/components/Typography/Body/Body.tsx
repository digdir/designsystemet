import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Body.module.css';

export interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * medium: 18px, small: 16px
   * @default "medium"
   */
  size?: 'medium' | 'small';
  /**
   * Paragraph text
   */
  children: React.ReactNode;
  /**
   * Adds margin-bottom
   */
  spacing?: boolean;
}

export const Body: OverridableComponent<BodyProps, HTMLParagraphElement> =
  forwardRef(
    (
      { className, size = 'medium', spacing, as: Component = 'p', ...rest },
      ref,
    ) => (
      <Component
        {...rest}
        ref={ref}
        className={cl(
          classes.body,
          {
            [classes.small]: size === 'small',
            [classes.spacing]: !!spacing,
          },
          className,
        )}
      />
    ),
  );
