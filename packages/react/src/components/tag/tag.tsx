import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type TagProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLSpanElement>,
  {
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
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
  { asChild, className, variant, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'span';

  return (
    <Component
      className={cl('ds-tag', className)}
      ref={ref}
      data-variant={variant}
      {...rest}
    />
  );
});
