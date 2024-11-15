import { forwardRef, useContext } from 'react';
import { Input, type InputProps } from '../../Input';
import { ComboboxContext } from './Combobox';

export type ComboboxInputProps = InputProps;

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxList(rest, ref) {
    const { listId } = useContext(ComboboxContext);

    /* We need an empty placeholder for the clear button to be able to show/hide */
    return <Input ref={ref} list={listId} placeholder='' {...rest} />;
  },
);
