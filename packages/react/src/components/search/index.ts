import { Search as SearchRoot } from './search';
import { SearchButton } from './search-button';
import { SearchClear } from './search-clear';
import { SearchInput } from './search-input';

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
const Search = Object.assign(SearchRoot, {
  Clear: SearchClear,
  Button: SearchButton,
  Input: SearchInput,
});

Search.Clear.displayName = 'Search.Clear';
Search.Button.displayName = 'Search.Button';
Search.Input.displayName = 'Search.Input';

export type { SearchProps } from './search';
export type { SearchButtonProps } from './search-button';
export type { SearchClearProps } from './search-clear';
export type { SearchInputProps } from './search-input';
export { SearchClear, SearchButton, SearchInput, Search };
