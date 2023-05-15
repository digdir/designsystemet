import type { ElementType, HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Heading.module.css';

export type HeadingProps = {
  /** Heading level. This will translate into any h1-6 level unless `as` is defined */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Changes text sizing */
  size: 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'xxsmall';
  /** Adds margin-bottom */
  spacing?: boolean;
} & HTMLAttributes<HTMLHeadingElement>;

/** Renders heading elements, h1-6 */
export const Heading: OverridableComponent<HeadingProps, HTMLHeadingElement> =
  forwardRef(
    (
      { level = 1, size = 'xlarge', spacing = false, className, as, ...rest },
      ref,
    ) => {
      const Component = as ?? (`h${level ?? 1}` as ElementType);

      return (
        <Component
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
