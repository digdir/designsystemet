import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

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
  size?: 'sm' | 'md' | 'lg';
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
    <span
      className={cl('ds-tag', className)}
      data-color={color}
      data-size={size}
      ref={ref}
      {...rest}
    />
  );
});
