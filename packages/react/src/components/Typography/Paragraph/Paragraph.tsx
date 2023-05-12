import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'classnames';

import type { OverridableComponent } from '../../../utils/OverridableComponent';

import classes from './Paragraph.module.css';

export type ParagraphProps = {
  /** Changes text sizing */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Adds margin-bottom */
  spacing?: boolean;
  /** Reduces line-height for short paragraphs */
  short?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Renders body text. Control text styles with props */
export const Paragraph: OverridableComponent<
  ParagraphProps,
  HTMLParagraphElement
> = forwardRef(
  (
    {
      className,
      size = 'medium',
      spacing,
      as: Component = 'p',
      short,
      ...rest
    },
    ref,
  ) => (
    <Component
      {...rest}
      ref={ref}
      className={cl(
        classes.paragraph,
        classes[size],
        {
          [classes.spacing]: !!spacing,
          [classes.short]: short,
        },
        className,
      )}
    />
  ),
);
