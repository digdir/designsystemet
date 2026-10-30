import { Search as SearchRoot } from './search';
import { SearchButton } from './search-button';
import { SearchClear } from './search-clear';
import { SearchInput } from './search-input';

type Search = typeof SearchRoot & {
  /**
   * Search.Clear component, used to display a clear button when the search input is not empty.
   *
   * @deprecated Will be removed in the next major version. Use `Suggestion` with `Suggestion.Clear` instead.
   *
   * @example
   * <Search>
   *   <Search.Input aria-label='Søk' />
   *   <Search.Clear />
   * </Search>
   */
  Clear: typeof SearchClear;
  /**
   * Search.Button component, used to display a search button within a Search component.
   *
   * @deprecated Will be removed in the next major version. Use a `Button` with `type="submit"` instead.
   *
   * @example
   * <Search>
   *   <Search.Input aria-label='Søk' />
   *   <Search.Button>Søk</Search.Button>
   * </Search>
   */
  Button: typeof SearchButton;
  /**
   * Search.Input component, used to display a search input within the Search component.
   *
   * @deprecated Will be removed in the next major version. Use `Input` with `type="search"` in a `Field` instead.
   *
   * @example
   * <Search>
   *   <Search.Input aria-label='Søk' />
   * </Search>
   */
  Input: typeof SearchInput;
};

/**
 * Search component, use to display different variations of a search input
 *
 * @deprecated Will be removed in the next major version. Use `Input` with `type="search"` in a `Field` instead, or `Suggestion` if you need a clear button.
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
const SearchComponent: Search = Object.assign(SearchRoot, {
  Clear: SearchClear,
  Button: SearchButton,
  Input: SearchInput,
});

SearchComponent.Clear.displayName = 'Search.Clear';
SearchComponent.Button.displayName = 'Search.Button';
SearchComponent.Input.displayName = 'Search.Input';

export type { SearchProps } from './search';
export type { SearchButtonProps } from './search-button';
export type { SearchClearProps } from './search-clear';
export type { SearchInputProps } from './search-input';
export { SearchButton, SearchClear, SearchComponent as Search, SearchInput };
