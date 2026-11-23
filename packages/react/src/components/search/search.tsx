import '@digdir/designsystemet-web'; // Load suggestion behavior
import type { DSSuggestionElement } from '@digdir/designsystemet-web';
import cl from 'clsx/lite';
import { forwardRef, type HTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';

/** @deprecated Will be removed in the next major version. */
export type SearchProps = DefaultProps & HTMLAttributes<DSSuggestionElement>;

/**
 * Search component, use to display different variations of a search input
 *
 * @deprecated Will be removed in the next major version. Use `Input` with `type="search"` in a `Field` instead. See {@link https://designsystemet.no/en/blog/search-is-being-removed-what-should-you-do | Search is being removed, what should you do?} for how to add a search button, search icon or clear button.
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
export const Search = forwardRef<DSSuggestionElement, SearchProps>(
  function Search({ className, ...rest }, ref) {
    // Using "class" since React does not translate className on custom elements
    return (
      <ds-suggestion
        ref={ref}
        class={cl('ds-search', className)}
        suppressHydrationWarning // Since <ds-suggestion> adds attributes
        {...rest}
      />
    );
  },
);
