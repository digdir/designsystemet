import { forwardRef } from 'react';
import { Button, type ButtonProps } from '../../Button';
import { setReactInputValue } from '../Combobox/utilities';

/* We omit children since we render the icon with css */
export type SearchClearProps = Omit<ButtonProps, 'variant' | 'children'> & {
  /**
   * Aria label for the clear button
   * @default 'Tøm'
   */
  'aria-label'?: string;
};

export const SearchClear = forwardRef<HTMLButtonElement, SearchClearProps>(
  function SearchClear({ 'aria-label': label = 'Tøm', onClick, ...rest }, ref) {
    const handleClear = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      const target = e.target;
      let input: HTMLElement | null | undefined = null;

      if (target instanceof HTMLElement)
        input = target.closest('.ds-search')?.querySelector('input');

      if (!input) throw new Error('Input is missing');
      /* narrow type to make TS happy */
      if (!(input instanceof HTMLInputElement))
        throw new Error('Input is not an input element');

      e.preventDefault();
      setReactInputValue(input, '');
      input.focus();
      onClick?.(e);
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
