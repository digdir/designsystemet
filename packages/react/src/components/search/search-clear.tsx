import { type ButtonHTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

/* We omit children since we render the icon with css */
export type SearchClearProps = MergeRight<
  DefaultProps & ButtonHTMLAttributes<HTMLButtonElement>,
  {
    /**
     * Aria label for the clear button
     * @deprecated Please use `--dsc-suggestion-sr-clear` or `data-sr-clear` on Suggestion to set label.
     */
    'aria-label'?: string;
  }
>;

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
        suppressHydrationWarning // Since <ds-suggestion> adds attributes
        type='reset'
        {...rest}
      />
    );
  },
);
