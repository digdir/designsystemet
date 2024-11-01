import { forwardRef } from 'react';
import { Button, type ButtonProps } from '../../Button';
import { setReactInputValue } from '../Combobox/utilities';

/* We omit children since we render the icon with css */
export type SearchClearProps = Omit<ButtonProps, 'variant' | 'children'>;

export const SearchClear = forwardRef<HTMLButtonElement, SearchClearProps>(
  function SearchClear({ 'aria-label': label = 'Tøm', onClick, ...rest }, ref) {
    const handleClear = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      const input =
        event.target instanceof HTMLElement &&
        event.target.closest('.ds-search')?.querySelector('input');

      if (!(input instanceof HTMLInputElement))
        throw new Error('Input is missing');

      event.preventDefault();
      setReactInputValue(input, '');
      input.focus();
      onClick?.(event);
    };

    return (
      <Button
        ref={ref}
        variant='tertiary'
        type='reset'
        aria-label={label}
        onClick={handleClear}
        icon={true}
        {...rest}
      />
    );
  },
);
