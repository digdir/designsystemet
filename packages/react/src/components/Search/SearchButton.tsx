import { type ReactNode, forwardRef } from 'react';

import type { MergeRight } from '../../utilities';
import { Button, type ButtonProps } from '../Button';

export type SearchButtonProps = MergeRight<
  ButtonProps,
  {
    /**
     * Variant of the button
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary';
    /**
     * Children of the button
     * @default 'Søk'
     */
    children?: ReactNode;
  }
>;

/**
 * SearchButton component, used to display a search button within a Search component.
 *
 * @example
 * <Search>
 *   <Search.Input aria-label='Søk' />
 *   <Search.Button>Søk</Search.Button>
 * </Search>
 */
export const SearchButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function SearchButton({ children = 'Søk', ...rest }, ref) {
    return (
      <Button ref={ref} type='submit' {...rest}>
        {children}
      </Button>
    );
  },
);
