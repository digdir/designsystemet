import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type TagProps = DefaultProps & {
  /**
   * Change the background color of the tag.
   *
   * @default 'default'
   */
  'data-variant'?: 'default' | 'tinted';
} & HTMLAttributes<HTMLSpanElement>;

/**
 * Use `Tag` to display categories or statuses.
 *
 * @example
 * <Tag>Melk</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { 'data-variant': variant = 'default', className, ...rest },
  ref,
) {
  return (
    <span
      className={cl('ds-tag', className)}
      data-variant={variant}
      ref={ref}
      {...rest}
    />
  );
});
