import { forwardRef } from 'react';

import type { MergeRight } from 'packages/react/src/utilities';
import { Button, type ButtonProps } from '../../Button';

export type SearchButtonProps = MergeRight<
  ButtonProps,
  {
    variant?: 'primary' | 'secondary';
    /**
     * Children of the button
     * @default 'Søk'
     */
    children?: React.ReactNode;
  }
>;

export const SearchButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function SearchButton({ children = 'Søk', ...rest }, ref) {
    return (
      <Button ref={ref} type='submit' {...rest}>
        {children}
      </Button>
    );
  },
);
