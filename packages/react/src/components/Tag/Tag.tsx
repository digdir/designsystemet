import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

type Size = Exclude<ParagraphProps['size'], 'xs'>;

export type TagProps = {
  /** Color of the tag
   * @default neutral
   */
  color?:
    | 'neutral'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'brand1'
    | 'brand2'
    | 'brand3';
  /**
   * Size of the tag
   * @default md
   */
  size?: Size;
} & HTMLAttributes<HTMLSpanElement>;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ size = 'md', color = 'neutral', children, className, ...rest }, ref) => {
    return (
      <Paragraph
        asChild
        size={size}
      >
        <span
          className={cl(
            'ds-tag',
            `ds-tag--${color}`,
            `ds-tag--${size}`,
            className,
          )}
          ref={ref}
          {...rest}
        >
          {children}
        </span>
      </Paragraph>
    );
  },
);

Tag.displayName = 'Tag';
