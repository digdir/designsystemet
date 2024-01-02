import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

import classes from './Tag.module.css';

type BrandColor = 'first' | 'second' | 'third';
type VariantColor = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
type Size = Exclude<ParagraphProps['size'], 'xsmall'>;

export type TagProps = {
  /** Color of the tag
   * @default neutral
   */
  color?: BrandColor | VariantColor;
  /** Size of the tag
   * @default medium
   */
  size?: Size;
  /** Variant of the tag
   * @default primary
   */
  variant?: 'primary' | 'secondary';
} & HTMLAttributes<HTMLSpanElement>;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      color = 'neutral',
      size = 'medium',
      variant = 'primary',
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <Paragraph
        as='span'
        size={size}
        {...rest}
        className={cl(
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
