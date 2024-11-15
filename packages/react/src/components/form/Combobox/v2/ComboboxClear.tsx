import { forwardRef } from 'react';
import { Button, type ButtonProps } from '../../../Button';
import { setReactInputValue } from '../utilities';

/* We omit children since we render the icon with css */
export type ComboboxClearProps = Omit<ButtonProps, 'variant' | 'children'> & {
  /**
   * Aria label for the clear button
   * @default 'Tøm'
   */
  'aria-label'?: string;
};

export const ComboboxClear = forwardRef<HTMLButtonElement, ComboboxClearProps>(
  function ComboboxClear(
    { 'aria-label': label = 'Tøm', onClick, ...rest },
    ref,
  ) {
    const handleClear = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      const target = event.target;
      let input: HTMLElement | null | undefined = null;

      if (target instanceof HTMLElement)
        input = target.closest('.ds-combobox2')?.querySelector('input');

      if (!input) throw new Error('Input is missing');
      /* narrow type to make TS happy */
      if (!(input instanceof HTMLInputElement))
        throw new Error('Input is not an input element');

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
