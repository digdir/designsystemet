import { forwardRef } from 'react';
import { Input } from '../Input';

export type SearchInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'readOnly' | 'type'
> &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never }
    | { 'aria-label'?: never; 'aria-labelledby': string }
  );

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <Input
        ref={ref}
        {...rest}
        type='search'
        /* We need an empty placeholder for the clear button to be able to show/hide */
        placeholder=''
        {...rest}
      />
    );
  },
);
