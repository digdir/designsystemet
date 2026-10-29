import { type ButtonHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';

/* We omit children since we render the icon with css */
/* The accessible name is set with `--dsc-suggestion-sr-clear` or `data-sr-clear` on the parent */
export type SearchClearProps = DefaultProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;

/**
 * SearchClear component, used to display a clear button when the search input is not empty.
 *
 * @example
 * <Search>
 *   <SearchInput aria-label='Søk' />
 *   <SearchClear />
 * </Search>
 */
export const SearchClear = forwardRef<HTMLButtonElement, SearchClearProps>(
  function SearchClear(rest, ref) {
    return (
      <button
        hidden
        ref={ref}
        type='reset'
        suppressHydrationWarning // Since <ds-suggestion> adds attributes
        {...rest}
      />
    );
  },
);
