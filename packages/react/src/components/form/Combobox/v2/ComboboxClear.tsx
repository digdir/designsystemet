import { forwardRef, useContext } from 'react';
import { Button, type ButtonProps } from '../../../Button';
import { setReactInputValue } from '../utilities';
import { ComboboxContext } from './Combobox';

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
    const { inputRef } = useContext(ComboboxContext);

    const handleClear = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (!inputRef?.current) throw new Error('Input is missing');
      /* narrow type to make TS happy */
      if (!(inputRef?.current instanceof HTMLInputElement))
        throw new Error('Input is not an input element');

      event.preventDefault();
      setReactInputValue(inputRef.current, '');
      inputRef.current.focus();
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
