import type {
  Color,
  SeverityColors,
} from '@digdir/designsystemet-react/colors';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type TagProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLSpanElement>,
  {
    /**
     * Change the color scheme of the tag
     */
    'data-color'?: Color | SeverityColors;
  }
>;

/**
 * Use `Tag` to display categories or statuses.
 *
 * @example
 * <Tag>Melk</Tag>
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { className, ...rest },
  ref,
) {
  return <span className={cl('ds-tag', className)} ref={ref} {...rest} />;
});
