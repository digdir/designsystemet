import { forwardRef, useContext } from 'react';
import { Input, type InputProps } from '../../Input';
import { ComboboxContext } from './Combobox';

export type ComboboxInputProps = InputProps;

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxList({ id, ...rest }, ref) {
    const { listId } = useContext(ComboboxContext);

    return <Input id={listId} ref={ref} list={listId} {...rest} />;
  },
);
