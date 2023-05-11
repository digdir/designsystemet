import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Text.module.css';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * medium: 18px, small: 16px
   * @default "medium"
   */
  size?: 'medium' | 'small';
  /**
   * Adds margin-bottom
   */
  spacing?: boolean;
}
/** Renders body text. Control text styles with props */
export const Text: OverridableComponent<TextProps, HTMLParagraphElement> =
  forwardRef(
    (
      { className, size = 'medium', spacing, as: Component = 'p', ...rest },
      ref,
    ) => (
      <Component
        {...rest}
        ref={ref}
        className={cl(
          classes.text,
          {
            [classes.small]: size === 'small',
            [classes.spacing]: !!spacing,
          },
          className,
        )}
      />
    ),
  );
