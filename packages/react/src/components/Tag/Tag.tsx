import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { Color } from '../../colors';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type TagProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLSpanElement>,
  {
    /**
     * Color of the tag.
     * @default neutral
     */
    'data-color'?: Color;
  }
>;

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
