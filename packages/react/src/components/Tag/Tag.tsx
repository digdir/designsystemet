import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

type Size = Exclude<ParagraphProps['size'], 'xsmall'>;

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
