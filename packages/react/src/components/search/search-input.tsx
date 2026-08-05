import { forwardRef, type InputHTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';
import { Input } from '../input/input';

export type SearchInputProps = DefaultProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'readOnly' | 'type'> & {
    /**
     * Type of input, affects if magnifying glass is shown or not. Use 'text' to hide magnifying glass.
     * @default 'search'
     */
    type?: 'text' | 'search';
  };

/**
 * SearchInput component, used to display a search input within the Search component.
 *
 * @example
 * <Search>
 *   <SearchInput aria-label='Søk' />
 * </Search>
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ type = 'search', ...rest }, ref) {
    return <Input ref={ref} type={type} {...rest} />;
  },
);
