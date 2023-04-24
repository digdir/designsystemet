import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Heading.module.css';
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level
   * @default "1"
   */
  level?: '1' | '2' | '3' | '4' | '5' | '6';
  /**
   * Changes text-sizing
   */
  size: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall';
  /**
   * Heading text
   */
  children: React.ReactNode;
  /**
   * Adds margin-bottom
   * @default false
   */
  spacing?: boolean;
}

export const Heading: OverridableComponent<HeadingProps, HTMLHeadingElement> =
  forwardRef(
    ({ level = '1', size, spacing = false, className, as, ...rest }, ref) => {
      const HeadingTag = as ?? (`h${level}` as React.ElementType);

      return (
        <HeadingTag
          {...rest}
          ref={ref}
          className={cl(
            classes.heading,
            classes[size],
            {
              [classes.spacing]: spacing,
            },
            className,
          )}
        />
      );
    },
  );

export default Heading;
