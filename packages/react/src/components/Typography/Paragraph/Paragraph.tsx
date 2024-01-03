import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './Paragraph.module.css';

export type ParagraphProps = {
  /** Changes text sizing */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /** Adds margin-bottom */
  spacing?: boolean;
  /** Reduces line-height for short paragraphs */
  short?: boolean;
} & HTMLAttributes<HTMLParagraphElement>;

/** Use `Paragraph` to display text with paragraph text styles. */
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
      {...rest}
    />
  ),
);
