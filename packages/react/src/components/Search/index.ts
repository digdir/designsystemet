import { Search as SearchRoot } from './Search';
import { SearchButton } from './SearchButton';
import { SearchClear } from './SearchClear';
import { SearchInput } from './SearchInput';

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

export type { SearchProps } from './Search';
export type { SearchButtonProps } from './SearchButton';
export type { SearchClearProps } from './SearchClear';
export type { SearchInputProps } from './SearchInput';
export { SearchClear, SearchButton, SearchInput, Search };
