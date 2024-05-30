import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';
import { getSize, getColor } from '../../utilities';

type Size = Exclude<ParagraphProps['size'], 'xsmall' | 'xs'>;
type OldColors = 'first' | 'second' | 'third';

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
    | 'brand3'
    | OldColors;
  /**
   * Size of the tag
   * @default md
   * @note `small`, `medium`, `large` is deprecated
   */
  size?: Size;
} & HTMLAttributes<HTMLSpanElement>;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, className, ...rest }, ref) => {
    const size = getSize(rest.size || 'md') as Size;
    const color = getColor(rest.color || 'neutral');

    return (
      <Paragraph
        asChild
        size={size}
      >
        <span
          className={cl(
            'fds-tag',
            `fds-tag--${color}`,
            `fds-tag--${size}`,
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
