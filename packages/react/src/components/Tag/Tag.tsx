import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type TagProps = DefaultProps & HTMLAttributes<HTMLSpanElement>;

/**
 * Use `Tag` to display a small piece of information.
 * @example
 * <Tag>Success</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { className, ...rest },
  ref,
) {
  return <span className={cl('ds-tag', className)} ref={ref} {...rest} />;
});
