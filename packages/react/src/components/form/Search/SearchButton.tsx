import { forwardRef } from 'react';

import { Button, type ButtonProps } from '../../Button';

export type SearchButtonProps = {
  variant?: 'primary' | 'secondary';
} & Omit<ButtonProps, 'variant'>;

export const SearchButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function SearchButton({ children = 'Søk', ...rest }, ref) {
    return (
      <Button ref={ref} type='submit' {...rest}>
        {children}
      </Button>
    );
  },
);
