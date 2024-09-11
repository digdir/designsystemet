import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

type Size = Exclude<ParagraphProps['size'], 'xs'>;

export type TagProps = {
  /**
   * Color of the tag
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

/**
 * Use `Tag` to display a small piece of information.
 * @example
 * <Tag color='success'>Success</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { size = 'md', color = 'neutral', className, ...rest },
  ref,
) {
  return (
    <Paragraph asChild size={size}>
      <span
        className={cl('ds-tag', className)}
        data-color={size}
        data-size={size}
        ref={ref}
        {...rest}
      />
    </Paragraph>
  );
});
