import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { Size } from '../../types';

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
   */
  'data-size'?: Size;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * Use `Tag` to display a small piece of information.
 * @example
 * <Tag color='success'>Success</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { color = 'neutral', className, ...rest },
  ref,
) {
  return (
    <span
      className={cl('ds-tag', className)}
      data-color={color}
      ref={ref}
      {...rest}
    />
  );
});
