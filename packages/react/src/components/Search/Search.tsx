import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { DefaultProps } from '../../types';

export type SearchProps = DefaultProps & React.HTMLAttributes<HTMLDivElement>;

/**
 * Search component, use to display different variations of a search input
 *
 * @example with button
 * <Search>
 *   <Search.Input aria-label='Søk' />
 *   <Search.Clear />
 *   <Search.Button />
 * </Search>
 *
 * @example with icon
 * <Search>
 *   <Search.Input aria-label='Søk' />
 *   <Search.Clear />
 * </Search>
 */
export const Search = forwardRef<HTMLDivElement, SearchProps>(function Search(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cl('ds-search', className)} {...rest} />;
});
