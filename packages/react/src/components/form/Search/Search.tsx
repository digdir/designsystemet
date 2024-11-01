import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { DefaultProps } from '../../../types';

export type SearchProps = DefaultProps & React.HTMLAttributes<HTMLDivElement>;

/** Search field
 *
 * @example
 * ```tsx
 * <Search aria-label="Search" />
 * ```
 */
export const Search = forwardRef<HTMLDivElement, SearchProps>(
  ({ 'data-size': size, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cl('ds-search', className)}
        data-size={size}
        {...rest}
      />
    );
  },
);

Search.displayName = 'Search';
