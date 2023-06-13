import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

import classes from './Tag.module.css';

type BrandColor = 'primary' | 'secondary' | 'tertiary';
type VariantColor = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type TagProps = {
  /** Color of the tag */
  color?: BrandColor | VariantColor;
  /** Size of the tag */
  size?: 'xsmall' | 'small' | 'medium';
  /** Variant of the tag */
  variant?: 'filled' | 'outlined';
} & HTMLAttributes<HTMLSpanElement>;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      color = 'neutral',
      size = 'medium',
      variant = 'filled',
      className,
      ...restHTMLProps
    },
    ref,
  ) => {
    return (
      <Paragraph
        as='span'
        size={size as ParagraphProps['size']}
        {...restHTMLProps}
        className={cn(
          classes.tag,
          classes[color],
          classes[size],
          classes[variant],
          className,
        )}
        ref={ref}
      >
        {children}
      </Paragraph>
    );
  },
);
