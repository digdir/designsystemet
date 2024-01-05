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
} & HTMLAttributes<HTMLSpanElement>;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    { children, color = 'neutral', size = 'medium', className, ...rest },
    ref,
  ) => {
    return (
      <Paragraph
        as='span'
        size={size}
        className={cl(classes.tag, classes[color], classes[size], className)}
        ref={ref}
        {...rest}
      >
        {children}
      </Paragraph>
    );
  },
);
