import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type TagProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLSpanElement>,
  {
    /**
     * The visual variant of the tag
     *
     * @default 'default'
     */
    variant?: 'default' | 'outline';
  }
>;

/**
 * Use `Tag` to display categories or statuses.
 *
 * @example
 * <Tag>Melk</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { className, variant, ...rest },
  ref,
) {
  return (
    <span
      className={cl('ds-tag', className)}
      ref={ref}
      data-variant={variant}
      {...rest}
    />
  );
});
