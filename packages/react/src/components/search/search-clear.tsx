import '@digdir/designsystemet-web'; // Load search-clear behavior
import { forwardRef } from 'react';
import { Button, type ButtonProps } from '../button/button';

/* We omit children since we render the icon with css */
export type SearchClearProps = Omit<ButtonProps, 'variant' | 'children'> & {
  /**
   * Aria label for the clear button
   * @default 'Tøm'
   */
  'aria-label'?: string;
};

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
  function SearchClear({ 'aria-label': label = 'Tøm', ...rest }, ref) {
    return (
      <Button
        aria-label={label}
        data-search='clear'
        ref={ref}
        variant='tertiary'
        {...rest}
      />
    );
  },
);
