import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { Color } from '../../colors';
import type { DefaultProps } from '../../types';
import type { Merge } from '../../utilities';

export type TagProps = Merge<
  DefaultProps & HTMLAttributes<HTMLSpanElement>,
  {
    /**
     * Color of the tag. Unlike most components, data-color must be specified on this element
     * — not an ancestor — to have an effect. Otherwise the default is used.
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
