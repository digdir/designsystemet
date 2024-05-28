import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';
import { getSize } from '../../utilities/getSize';

type Size = Exclude<ParagraphProps['size'], 'xsmall' | 'xs'>;

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
    | 'first'
    | 'second'
    | 'third';
  /**
   * Size of the tag
   * @default md
   * @note `small`, `medium`, `large` is deprecated
   */
  size?: Size;
} & HTMLAttributes<HTMLSpanElement>;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, color = 'neutral', className, ...rest }, ref) => {
    const size = getSize(rest.size || 'md') as Size;

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
