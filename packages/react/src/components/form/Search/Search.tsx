import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { DefaultProps } from '../../../types';

export type SearchProps = DefaultProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * Search field
 *
 * @example
 * ```tsx
 * <Search>
 *  <Search.Input aria-label='Søk' />
 *  <Search.Clear />
 *  <Search.Button />
 * </Search>
 * ```
 */
export const Search = forwardRef<HTMLDivElement, SearchProps>(
  ({ className, ...rest }, ref) => {
    return <div ref={ref} className={cl('ds-search', className)} {...rest} />;
  },
);

Search.displayName = 'Search';
